import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Img, TextArea, Button } from "../components"; // Import Img, TextArea, and Button components
import Sidebar1 from "../components/SideBar";
import { useNavigate,useLocation } from "react-router-dom";
import DropdownMenu from "../components/DropDown";



const dropDownOptions = [
  { label: "Personal Information", value: "option1" },
  { label: "Log Out", value: "option2" },
];

const ImageDisplayPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePaths, setImagePaths] = useState([
    "images/img_unsplash_s3ejzlra4yw.png",
    "images/img_unsplash_cqblg3lzepk.png",
    "images/img_unsplash_xfngap_dtoe.png",
    "images/img_unsplash_yffgke3y4f8.png",
    "images/img_unsplash_g30p1zcozxo.png",
  ]);
  const [pipeNumbers, setPipeNumbers] = useState([]); // State to hold pipe numbers
  const [pipeResults, setPipeResults] = useState([]); // State to hold pipe results
  const [comments, setComments] = useState(""); // State to hold the value of the text area
  const [showConfirmation, setShowConfirmation] = useState(false); // State to manage confirmation dialog
  const [overlayVisible, setOverlayVisible] = useState(false); // State to manage overlay visibility
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;
  
  useEffect(() => {
    // Fetch image data from the backend when the component mounts
    fetchImageData();
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  const fetchImageData = () => {
    // Fetch image data from the backend API
    fetch("https://tu-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod/images")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch image data");
        }
      })
      .then((data) => {
        // Extract pipe numbers, pipe results, and image paths from the fetched data
        const pipeNumbers = data.map((item) => item.pipeNumber);
        const pipeResults = data.map((item) => item.result);
        const imagePaths = data.map((item) => item.imagePath);

        // Set the extracted data to the state
        setPipeNumbers(pipeNumbers);
        setPipeResults(pipeResults);
        setImagePaths(imagePaths);
      })
      .catch((error) => {
        console.error("Error fetching image data:", error);
        // Handle error accordingly
      });
  };

  // Dummy PipeInfoBox component
const PipeInfoBox = ({ pipeNumber, result }) => {
  return (
    <div className="pipe-info-box">
      <h2>
        Pipe Result: Pipe Number {pipeNumber} | Condition: {result}
      </h2>
    </div>
  );
};

  const handleOptionChange = (selectedOption) => {
    if (selectedOption.value === "option1") {
      navigate("/accountinformation", { state: { isAdmin } });
    } else if (selectedOption.value === "option2") {
      navigate("/signin");
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imagePaths.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imagePaths.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => prevZoom + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(0.1, prevZoom - 0.1));
  };

  const handleDenyImage = () => {
    setShowConfirmation(true); // Show confirmation dialog
    setOverlayVisible(true); // Show overlay
  };

  const confirmDenyImage = () => {
    setShowConfirmation(false); // Hide confirmation dialog
    setOverlayVisible(false); // Hide overlay

    // Get the image key to delete
    const imageKey = imagePaths[currentImageIndex];

    // Send a DELETE request to your backend API to delete the image
    fetch("https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/s3bucket/images", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_key: imageKey }),
    })
      .then((response) => {
        if (response.ok) {
          // Image deletion successful
          console.log("Image deleted successfully");
          // Remove the deleted image path from the state
          const updatedImagePaths = imagePaths.filter((path) => path !== imageKey);
          setImagePaths(updatedImagePaths);
          // If the current image index is now out of bounds, adjust it
          setCurrentImageIndex((prevIndex) =>
            prevIndex >= updatedImagePaths.length ? updatedImagePaths.length - 1 : prevIndex
          );
        } else {
          // Image deletion failed
          console.error("Failed to delete image");
          // Handle error accordingly
        }
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
        // Handle error accordingly
      });
  };

  const handleGenerateReport = () => {
    // Save the comments
    const commentsData = comments;

    // Prepare an array of objects for each image with its result and image path
    const reports = imagePaths.map((imagePath, index) => ({
      imageIndex: index,
      result: pipeResults[index], // Get the corresponding pipe result
      imagePath: imagePath,
      
    }));
    

    // Log the report data to console
    console.log("Generated Reports:", reports);

    // Log comments data to console
    console.log("InspectorComments:", commentsData);

    // send comments and reports to the backend
    fetch("https://tu-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reports: reports, comments: commentsData }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to send reports and comments");
        }
      })
      .then((data) => {
        console.log("Reports and comments sent successfully:", data);
        navigate("/reportgenerated", { state: { isAdmin } });
      })
      .catch((error) => {
        console.error("Error sending reports and comments:", error);
        navigate("/reportgenerated", { state: { isAdmin } });
      });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setComments(value);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false); // Hide confirmation dialog
    setOverlayVisible(false); // Hide overlay
  };

  return (
    <>
      <Helmet>
        <title>BitBusters</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>
      <div className="relative">
        {overlayVisible && <div className="fixed inset-0 bg-black opacity-50 z-50"></div>}
        <div className="flex md:flex-col justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">
        <Sidebar1 isAdmin={isAdmin} className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
        
          <div
            className="flex justify-center w-full md:w-full ml-[300px]"
            style={{
              minWidth: "1410px",
              minHeight: "968px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div className="flex flex-col items-start w-full ">
              <div
                className="md:p-5 bg-white-A700 rounded-[30px] relative overflow-hidden"
                style={{
                  width: "50%",
                  marginLeft: "15%",
                  marginRight: "auto",
                  marginTop: "140px",
                  height: "600px",
                  boxShadow: "0px 0px 0px 5px rgba(0, 0, 0, 1.5)",
                }}
              >
                <div
                  className="relative"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transition: "transform 0.2s ease-in-out",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <a
                    href={imagePaths[currentImageIndex]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Img
                      src={imagePaths[currentImageIndex]}
                      alt={`image_${currentImageIndex}`}
                      className="object-cover rounded-[0px]"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </a>
                </div>
              </div>
              <div className="absolute top-[160px] right-[450px] flex flex-col">
                <Button
                  color="#000"
                  size="xs"
                  onClick={handleZoomIn}
                  className="w-[40px] h-[40px] rounded-full bg-white font-bold flex items-center justify-center mb-2 transition-transform duration-300 hover:scale-150"
                  style={{ zIndex: 1, fontSize: "30px" }}
                >
                  +
                </Button>
                <Button
                  color="#000"
                  size="xs"
                  onClick={handleZoomOut}
                  className="w-[40px] h-[40px] rounded-full bg-white  font-bold flex items-center justify-center transition-transform duration-300 hover:scale-150"
                  style={{ zIndex: 1, fontSize: "30px" }}
                >
                  -
                </Button>
              </div>
              <div className="ml-[420px] mt-5">
                {/* Display the pipe number and result */}
                <PipeInfoBox
                  pipeNumber={pipeNumbers[currentImageIndex]}
                  result={pipeResults[currentImageIndex]}
                />
              </div>
              <div className="flex justify-center items-center w-[91%] md:w-full mt-[18px] ml-[-70px] gap-2">
                <Button
                  color="gray_900_e5"
                  size="sm"
                  rightIcon={<Img src="images/img_creditcardoff.svg" alt="credit_card_off" />}
                  className="gap-3 sm:px-5 min-w-[264px] rounded-[32px] hover:bg-gray-500 transition-colors duration-300"
                  onClick={handleDenyImage}
                >
                  Deny Image
                </Button>
                <Button
                  color="green_400"
                  size="sm"
                  rightIcon={<Img src="images/img_cached.svg" alt="cached" />}
                  className="gap-3 sm:px-5 min-w-[264px] rounded-[32px] hover:bg-green-700 transition-colors duration-300"
                  onClick={handleGenerateReport}
                   // Call handleGenerateReport on button click
                >
                  Generate Report
                </Button>
              </div>
              <div className="items-start w-[95%] md:w-full mt-[30px] ml-40 gap-5 md:ml-0">
                <TextArea
                  shape="round"
                  name="singleinput_one"
                  placeholder={`Comments...`}
                  value={comments}
                  onChange={handleChange}
                  className="w-[64%] sm:pb-5 sm:pr-5 text-gray-700_01 font-medium"
                />
              </div>
            </div>
            <div className="absolute top-1/2 transform -translate-y-1/2 left-[150px]">
              <div className="arrow-button" onClick={handlePreviousImage}>
                <Img src="images/img_arrow_left.svg" alt="arrowleft_one" className="h-[24px] w-[24px] transition-transform duration-300 hover:scale-150" />
              </div>
            </div>
            <div className="absolute top-1/2 transform -translate-y-1/2 right-[450px]">
              <div className="arrow-button" onClick={handleNextImage}>
                <Img src="images/img_arrow_right.svg" alt="arrowright_one" className="h-[24px] w-[24px] transition-transform duration-300 hover:scale-150" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-start gap-[2px] absolute top-0 right-4">
          <DropdownMenu options={dropDownOptions} onChange={handleOptionChange} />
        </div>
        {showConfirmation && (
          <div className="fixed top-0 left-40 w-full h-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-md shadow-md" style={{ backgroundColor: "white" }}>
              <p className="text-lg mb-4">Are you sure you want to deny this image?</p>
              <div className="flex justify-between">
                <button onClick={handleCancelConfirmation} className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right">Cancel</button>
                <button onClick={confirmDenyImage} className="text-white-A700 border border-gray-500 bg-red-600  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-red-800">Deny Image</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageDisplayPage;
