import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Img, TextArea, Button } from "../components"; // Import Img, TextArea, and Button components
import Sidebar1 from "../components/SideBar";
import { useNavigate,useLocation } from "react-router-dom";
import DropdownMenu from "../components/DropDown";
import { useContext, } from "react";
import { reportGenerationContext } from "../components/Context";
import { Amplify } from 'aws-amplify';
import config from '../aws-exports';
import { downloadData } from 'aws-amplify/storage';

Amplify.configure(config);


const dropDownOptions = [
  { label: "Personal Information", value: "option1" },
  { label: "Log Out", value: "option2" },
];

const ImageDisplayPage = () => {
  const [currentPipe, setCurrentPipe] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePaths, setImagePaths] = useState({});
  const [pipeNumbers, setPipeNumbers] = useState([]); // State to hold pipe numbers
  const [pipeResults, setPipeResults] = useState([]); // State to hold pipe results
  const [comments, setComments] = useState(""); // State to hold the value of the text area
  const [showConfirmation, setShowConfirmation] = useState(false); // State to manage confirmation dialog
  const [overlayVisible, setOverlayVisible] = useState(false); // State to manage overlay visibility
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;
  const { data, setValues } = useContext(reportGenerationContext); //USE THIS TO UPDATE AND PASS THE INFORMATION BETWEERN PAGES
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await saveUrlsFromS3();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error accordingly
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  const saveUrlsFromS3 = async () => {
    const allUsableUrls = {};
    await Promise.all(
      Object.entries(data.images).map(async ([pipeKey, pipeArray]) => {
        const usableUrls = await Promise.all(
          pipeArray.map(async (pipe) => {
            const url = pipe.url;
            const parts = url.split('/');
            const bucket_name = parts[2].split('.')[0];
            const objectKey = parts.slice(4).join('/');
            const downloadResult = await downloadData({ key: objectKey }).result;
            const blobThing = await downloadResult.body.blob();
            return URL.createObjectURL(blobThing);
          })
        );
        allUsableUrls[pipeKey] = usableUrls;
      })
    );
    setImagePaths(allUsableUrls);
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      await saveUrlsFromS3();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error accordingly
      setLoading(false);
    }
  };

  fetchData();
}, []);
const PipeInfoBox = ({ pipeNumber, result }) => {
  pipeNumber = pipeNumber + 1;

  const pipeKey = Object.keys(imagePaths)[currentPipe];
  const pipeImages = data.images[pipeKey];

  if (pipeImages && Array.isArray(pipeImages) && pipeImages.length > 0) {
    if (currentImageIndex >= 0 && currentImageIndex < pipeImages.length) {
      const currentImage = pipeImages[currentImageIndex];
      const predictions = currentImage?.predictions;

      if (predictions[0] > predictions[1]) {
        result = "Not Broken";
      } else {
        result = "Broken";
      }
    }
  } else {
    result = "No images left";
    pipeNumber = "No images left";
  }
  
  return (
    <div
      className="w-[254px] h-[104px] rounded-[24px] bg-white shadow-md p-3 ml-[25px] flex flex-col items-center justify-center"
      style={{ zIndex: 1 }}
    >
      <p className="text-base font-bold text-gray-700_01">{`Pipe ${pipeNumber}`}</p>
      <p className="text-sm font-medium text-gray-700_01">{`Result: ${result || "N/A"}`}</p>
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
      prevIndex === 0 ? (imagePaths[Object.keys(imagePaths)[currentPipe]]?.length || 0) - 1 : prevIndex - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === (imagePaths[Object.keys(imagePaths)[currentPipe]]?.length || 0) - 1 ? 0 : prevIndex + 1
    );
  };
  

  const handlePreviousPipe = () => {
    setCurrentPipe((prevPipe) => Math.max(0, prevPipe - 1));
    setCurrentImageIndex(0); // Reset image index when navigating to a new pipe
  };
  
  const handleNextPipe = () => {
    setCurrentPipe((prevPipe) => Math.min(Object.keys(data.images).length - 1, prevPipe + 1));
    setCurrentImageIndex(0); // Reset image index when navigating to a new pipe
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
  
    const pipeKey = Object.keys(imagePaths)[currentPipe];
    const imageUrl = data.images[pipeKey][currentImageIndex].url;
    const imageKey = imageUrl.split('/').pop(); // Extract the image key from the URL
    const prefixedImageKey = `public/Images/${imageKey}`; // Construct the prefixed image key
  
    console.log("Deleting image with key:", prefixedImageKey); // Log the prefixed image key for debugging
  
    fetch("https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/s3bucket/images", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_key: prefixedImageKey }), // Construct the requestBody dynamically
    })
      .then((response) => {
        if (response.ok) {
          // Image deletion successful
          console.log("Image deleted successfully");
  
          // Update state to remove the deleted image and its result
          const updatedImagePaths = { ...imagePaths };
          console.log("update image first ", updatedImagePaths);
  
          const filteredImages = updatedImagePaths[pipeKey].filter(
            (_, index) => index !== currentImageIndex
          );
          updatedImagePaths[pipeKey] = filteredImages;
  
          console.log("update image second ", updatedImagePaths);
          setImagePaths(updatedImagePaths);
  
          // Update the data.images object to remove the deleted image and its result
          const updatedImages = { ...data.images };
          updatedImages[pipeKey] = updatedImages[pipeKey].filter(
            (_, index) => index !== currentImageIndex
          );
          setValues({ ...data, images: updatedImages });
  
          // Wait for the state update to complete before accessing the updated state
          setTimeout(() => {
            console.log("image path ", imagePaths);
  
            // Update current image index if needed
            const remainingImages = updatedImagePaths[pipeKey];
            console.log("image remain image ", remainingImages);
  
            const updatedIndex = Math.min(currentImageIndex, remainingImages.length - 1);
            console.log("image update index ", updatedIndex);
  
            setCurrentImageIndex(updatedIndex);
            console.log("image current image index ", currentImageIndex);
          }, 0);
        } else {
          // Image deletion failed
          console.error("Failed to delete image");
          // Handle error accordingly
        }
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
        // Log any errors that occur during the deletion process
        // Handle error accordingly
      });
  };
  
  
  
  

  const handleGenerateReport = () => {
    // Save the comments
    const commentsData = comments;
  
    // Prepare an array of objects for each image with its result and image path
    const reports = [];
    Object.keys(imagePaths).forEach((pipeKey) => {
      const pipeImages = imagePaths[pipeKey];
      const pipeResult = pipeResults[pipeKey]; // Retrieve pipe result
      if (pipeResult) { // Check if pipe result is defined
        pipeImages.forEach((imagePath, index) => {
          // Check if pipe result at index is defined
          const result = pipeResult[index] !== undefined ? pipeResult[index] : "Result not available";
          reports.push({ pipeKey, imagePath, result });
          navigate("/reportgenerated", { state: { isAdmin } });
        });
      } else {
        // Log or handle the case where pipe result is undefined
        console.error(`Result for pipe ${pipeKey} is undefined`);
        navigate("/reportgenerated", { state: { isAdmin } });
      }
    });
  
    // Log the report data to console
    console.log("Generated Reports:", reports);
  
    // Log comments data to console
    console.log("InspectorComments:", commentsData);


  };

  const handleChange = (e) => {
    const { value } = e.target;
    setComments(value);
    setValues({...data, comments: value});
    console.log("Comments: ",data.comments)
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false); // Hide confirmation dialog
    setOverlayVisible(false); // Hide overlay
  };

  if(!loading) {return (
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
            className="flex justify-center w-full md:w-full ml-[300px] mt-[-80px]"
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
      
                      {imagePaths &&
                  Object.keys(imagePaths).length > 0 &&
                  imagePaths[Object.keys(imagePaths)[currentPipe]] &&
                  imagePaths[Object.keys(imagePaths)[currentPipe]].length > 0 ? (
                    <a
                      href={imagePaths[Object.keys(imagePaths)[currentPipe]][currentImageIndex]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                     <Img
  src={imagePaths[Object.keys(imagePaths)[currentPipe]][currentImageIndex]}
  alt={`image_${currentImageIndex}`}
  className="object-cover rounded-[0px]"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover", // Change objectFit to cover
  }}
/>


                        </a>
                      ) : (
                        <div className="flex justify-center items-center h-full">
                          <p className="text-2xl font-bold"></p>
                        </div>
                      )
                    }
                    </div>
                          </div>
                            <div className="pipe-navigation flex justify-center items-center mt-5 absolute top-[75%] left-[32%] transform [-translate-x-50%] [-translate-y-50%]">
                                <button
                  onClick={handlePreviousPipe}
                  className="border border-gray-500 bg-zinc-300 rounded-3xl py-1 px-2 hover:bg-zinc-400 mr-4"
                >
                  Previous Pipe
                </button>
                <button
                  onClick={handleNextPipe}
                  className="border border-gray-500 bg-zinc-300 rounded-3xl py-1 px-4 hover:bg-zinc-400"
                >
                  Next Pipe
                </button>

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
                  pipeNumber={currentPipe}
                  result={pipeResults[currentImageIndex]}
                />
              </div>
              <div className="flex justify-center items-center w-[91%] md:w-full mt-[60px] ml-[-70px] gap-2">
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
              <div className="items-start w-[95%] md:w-full mt-[10px] ml-40 gap-5 md:ml-0">
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
                <Img src="images/img_arrow_left.svg" alt="arrowleft_one" className="h-[32px] w-[32px] transition-transform duration-300 hover:scale-150" />
              </div>
            </div>
            <div className="absolute top-1/2 transform -translate-y-1/2 right-[450px]">
              <div className="arrow-button" onClick={handleNextImage}>
                <Img src="images/img_arrow_right.svg" alt="arrowright_one" className="h-[32px] w-[32px] transition-transform duration-300 hover:scale-150" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-start gap-[2px] absolute top-0 right-1">
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
  );}
  else{
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
        }}
      >
        <div
          style={{
            border: '4px solid #ccc',
            borderTopColor: '#333',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ marginTop: '16px', fontSize: '16px', color: '#333' }}>
          Loading Images...
        </p>
      </div>
    );
  }
  };

export default ImageDisplayPage;