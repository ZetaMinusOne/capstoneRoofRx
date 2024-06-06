import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Img, TextArea, Button } from "../components"; // Import Img, TextArea, and Button components
import Sidebar1 from "../components/SideBar";
import { useNavigate, useLocation } from "react-router-dom";
import DropdownMenu from "../components/DropDown";
import { useContext, } from "react";
import { reportGenerationContext } from "../components/Context";
import { Amplify } from 'aws-amplify';
import config from '../aws-exports';
import { downloadData } from 'aws-amplify/storage';
import AWS from 'aws-sdk';

Amplify.configure(config);


const dropDownOptions = [
  { label: "Personal Information", value: "option1" },
  { label: "Log Out", value: "option2" },
];

const ResultsPage = () => {
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
    console.log("data from Analyze Images:", data)
    const savedData = window.localStorage.getItem("data")
    const savedDataParse = savedData ? JSON.parse(savedData) : null;
    console.log("JSON.parse(savedData) in Analyze Images", JSON.parse(savedData))
    console.log(data)

    if (savedDataParse) setValues({ ...data, ...savedDataParse })
    //  console.log("data",data)
  }, [])

  useEffect(() => {
    console.log("data from Analyze Images:", data)
    window.localStorage.setItem("data", JSON.stringify(data))
    console.log('JSON.stringify(data))', JSON.stringify(data))
    console.log(data)
  }, [data])

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

  useEffect(() =>{
    console.log("New Image Paths", imagePaths);
    setLoading(false);
  }, [imagePaths]);


  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const saveUrlsFromS3 = async () => {
    // setLoading(true);
    // const allUsableUrls = {};
    console.log("data.images", data.images);
        // setResult(response.data.result);
          const s3 = new AWS.S3({
            accessKeyId: 'AKIAR7NCUGFH5QXSLHUT',//process.env.REACT_APP_ACCESS_KEY_ID,
            secretAccessKey: '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',//process.env.REACT_APP_SECRET_ACCESS_KEY,
          });
          const params = {Bucket: 'roofrx', Key: 
          data.images.classified_image_path};

        console.log("The params are", params);
          const downloadResult = s3.getObject(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred

            console.log("The download result is", data);
            let blob = new Blob([data.Body], {type: 'image/jpeg'});

            const url = URL.createObjectURL(blob);
            console.log("The URL is", url);
            setImagePaths({ index: 0, url: url});
          });
    
          // s3.getSignedUrl('getObject', params, function (err, url) {
          //   console.log(params);
          //   console.log(err)
          //   console.log("The URL is", url);
          //   // setImresult(url);
          //   setImagePaths({index: 0, url: url});
          // });
   
    
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
  }, [data]);
  const ResultBox = ({ result }) => {


    return (
      <div
        className="max-w-[254px] h-[104px] rounded-[24px] bg-white shadow-md flex flex-col items-center justify-center m-auto"
        style={{ zIndex: 1 }}
      >
        <p className="text-base font-bold text-gray-700_01">{`Result: ${result || "N/A"}`}</p>
        {/* <p className="text-sm font-medium text-gray-700_01">{`Result: ${result || "N/A"}`}</p> */}
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
      .then(async (response) => {
        if (response.ok) {
          // Image deletion successful
          console.log("Image deleted successfully");
  
          // Update state after successful deletion
          const updatedImages = { ...data.images };
          
          updatedImages[pipeKey].splice(currentImageIndex, 1);
  
          const updatedImagePaths = { ...imagePaths };
          updatedImagePaths[pipeKey] = updatedImagePaths[pipeKey].filter(
            (_, index) => index !== currentImageIndex
          );
  
          setValues({ ...data, images: updatedImages });
          setImagePaths(updatedImagePaths);

          // Check if the pipe's array is empty after deletion
          if (updatedImages[pipeKey].length === 0) {
            // Remove the pipe from the dictionary if it's empty
            delete updatedImages[pipeKey];
            // Update state with the pipe removed
            setValues({ ...data, images: updatedImages });
          }
  
          // Update current image index if needed
          const remainingImages = updatedImagePaths[pipeKey];
          const updatedIndex = Math.min(currentImageIndex, remainingImages.length - 1);
          setCurrentImageIndex(updatedIndex);
          // setCurrentPipe((prevPipe) => {
          //   const pipeKeys = Object.keys(updatedImages);
          //   const currentPipeIndex = pipeKeys.indexOf(pipeKey); // Get the index of the current pipe
          //   const nextPipeIndex = currentPipeIndex > 0 ? currentPipeIndex - 1 : 1; // Update the index accordingly
          //   return nextPipeIndex;
          // });
          setImagePaths({});
          await saveUrlsFromS3();
          handlePreviousPipe();
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
    // Object.keys(imagePaths).forEach((pipeKey) => {
      const pipeImages = imagePaths.url;
      const pipeResult = data.images.result; // Retrieve pipe result
      if (pipeResult) { // Check if pipe result is defined
        // pipeImages.forEach((imagePath, index) => {
          // Check if pipe result at index is defined
          const result = pipeResult;
          reports.push({ index: 0, pipeImages, result });
          navigate("/report", { state: { isAdmin } });
        // });
      } else {
        // Log or handle the case where pipe result is undefined
        console.error(`Result for pipe 0 is undefined`);
        navigate("/report", { state: { isAdmin } });
      }
    // });

    // Log the report data to console
    console.log("Generated Reports:", reports);

    // Log comments data to console
    console.log("InspectorComments:", commentsData);


  };

  const handleChange = (e) => {
    const { value } = e.target;
    setComments(value);
    setValues({ ...data, comments: value });
    console.log("Comments: ", data.comments)
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false); // Hide confirmation dialog
    setOverlayVisible(false); // Hide overlay
  };

  if (!loading) {
    return (
      <>
        <Helmet>
          <title>Analyze Images</title>
          <meta
            name="description"
            content="Web site created using create-react-app"
          />
        </Helmet>
        <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">
          <div className="flex justify-end items-start gap-[2px] absolute top-0 right-0">
            <DropdownMenu options={dropDownOptions} onChange={handleOptionChange} />
          </div>
          {/* {overlayVisible && <div className="fixed inset-0 bg-black opacity-50 z-50"></div>} */}
          <Sidebar1 isAdmin={isAdmin} className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
          <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700 ">


            <div className="flex flex-col justify-center w-full m-auto"
            // style={{
            //   maxWidth: "1410px",
            //   maxHeight: "968px",
            //   overflow: "hidden",
            //   // position: "relative",
            // }}
            >

              {/* <div className="flex flex-col items-start w-full m-auto"> */}
              <div className=" ml-auto mr-auto mt-[140px] w-full h-[420px] max-w-[600px] bg-white-A700 rounded-[30px] relative overflow-hidden border-4 border-black-900"
              >

                <div
                  className="relative m-auto"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transition: "transform 0.2s ease-in-out",
                    // width: "100%",
                    // height: "100%",
                  }}
                >

                  {/* {imagePaths &&
                    Object.keys(imagePaths).length > 0 &&
                    imagePaths[Object.keys(imagePaths)[currentPipe]] &&
                    imagePaths[Object.keys(imagePaths)[currentPipe]].length > 0 ? ( */}
                    {/* <a
                      href={imagePaths[Object.keys(imagePaths)[currentPipe]][currentImageIndex]}
                      target="_blank"
                      rel="noopener noreferrer"
                    > */}
                      <Img
                        src={imagePaths.url}
                        alt={`image_tiles_results`}
                        className="object-cover rounded-[0px] m-auto w-full h-full"
                        style={{
                          objectFit: "cover", // Change objectFit to cover
                        }}
                      />


                    {/* </a> */}
                  {/* ) : (
                    <div className="flex justify-center items-center h-full m-auto">
                      <p className="text-2xl font-bold"></p>
                    </div>
                  )
                  } */}
                </div>
              </div>
              {/* <div className=" flex w-100% max-w-[600px] m-auto justify-center align-middle mt-[10px]"> */}

                {/* <div className="m-auto" onClick={handlePreviousImage}>
                  <Img src="images/img_arrow_left.svg" alt="arrowleft_one" className="h-[32px] w-[200px] transition-transform duration-300 hover:scale-150"/>
                </div> */}
                {/* Images */}
                {/* <div className="transform  "> */}
                  {/* <div className="m-auto" onClick={handleNextImage}>
                    <Img src="images/img_arrow_right.svg" alt="arrowright_one" className="h-[32px] w-[200px] transition-transform duration-300 hover:scale-150" /> */}
                  {/* </div> */}
                {/* </div> */}
              {/* </div> */}
              <div className=" flex justify-center w-full item-start m-auto" >
                {/* className="flex justify-end w-full pr-5 absolute bottom-2 text-gray-500 text-xs pointer-events-none" */}
                {/* // flex justify-end w-full items-start gap-[2px] absolute top-0 rigth-0 */}

                <Button
                  color="#000"
                  size="xs"
                  onClick={handleZoomOut}
                  className="w-[40px] h-[40px] rounded-full bg-white  font-bold flex items-center justify-center transition-transform duration-300 hover:scale-150"
                  style={{ zIndex: 1, fontSize: "30px" }}
                >
                  -
                </Button>
                <p className="justify-center text-center pt-3"> Zoom </p>
                <Button
                  color="#000"
                  size="xs"
                  onClick={handleZoomIn}
                  className="w-[40px] h-[40px] rounded-full bg-white font-bold flex items-center justify-center mb-2 transition-transform duration-300 hover:scale-150 "
                  style={{ zIndex: 1, fontSize: "30px" }}
                >
                  +
                </Button>
              </div>
              {/* <div className="flex justify-center items-center mt-5 ml-auto mr-auto">

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

              </div> */}

              <div className=" m-auto mt-[40px] w-full justify-center">
                {/* Display the pipe number and result */}
                <ResultBox
                  result={data.images.result}
                />
              </div>
              <div className="flex flex-box w-full mt-[40px] gap-2 m-auto max-w-[600px]">
                {/* <Button
                  color="gray_900_e5"
                  size="sm"
                  rightIcon={<Img src="images/img_creditcardoff.svg" alt="credit_card_off" />}
                  className="w-[264px] rounded-[32px] hover:bg-gray-500 transition-colors duration-300 m-auto"
                  onClick={handleDenyImage}
                  disabled={!imagePaths[Object.keys(imagePaths)[currentPipe]] || imagePaths[Object.keys(imagePaths)[currentPipe]].length === 0} // Disable the button if there are no images in the current pipe
                >
                  Deny Image
                </Button> */}

                <Button
                  color="green_400"
                  size="sm"
                  rightIcon={<Img src="images/img_cached.svg" alt="cached" />}
                  className="w-[264px] rounded-[32px] hover:bg-gray-500 transition-colors duration-300 m-auto"
                  onClick={handleGenerateReport}
                // Call handleGenerateReport on button click
                >
                  Generate Report
                </Button>
              </div>
              <div className="items-start w-full max-w-[600px] mt-[10px] gap-5 m-auto">
                <TextArea
                  shape="round"
                  name="singleinput_one"
                  placeholder={`Comments...`}
                  value={comments}
                  onChange={handleChange}
                  className="w-full sm:pb-5 sm:pr-5 text-gray-700_01 font-medium"
                />
              </div>
              {/* </div> */}

              {/* <div className="absolute top-1/2 right-1/2 transform translate-y-1/2 left-[150px] border"> */}

              {/* </div> */}

            </div>
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
  }
  else {
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

export default ResultsPage;