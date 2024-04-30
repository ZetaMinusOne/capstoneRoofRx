// Import React and necessary components
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Img, TextArea, Button } from "../components";
import Sidebar1 from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../components/DropDown";

// Define drop-down menu options and image paths
const dropDownOptions = [
  { label: "Personal Information", value: "option1" },
  { label: "Log Out", value: "option2" },
];

const imagePaths = [
  "images/img_unsplash_s3ejzlra4yw.png",
  "images/img_unsplash_cqblg3lzepk.png",
  "images/img_unsplash_xfngap_dtoe.png",
  "images/img_unsplash_yffgke3y4f8.png",
  "images/img_unsplash_g30p1zcozxo.png",
];

// Define PipeInfoBox component
const PipeInfoBox = ({ pipeNumber, result }) => (
  <div className="flex justify-center items-center ml-4">
    <div className="text-xl font-bold mr-2">Pipe:</div>
    <div className="text-lg mr-4">{pipeNumber}</div>
    <div className="text-xl font-bold mr-2">Result:</div>
    <div className="text-lg mr-4">{result}</div>
    <div className="text-lg">Picture {pipeNumber}</div>
  </div>
);

// Define ImageDisplayPage component
const ImageDisplayPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const navigate = useNavigate();

  // Handle drop-down menu option change
  const handleOptionChange = (selectedOption) => {
    if (selectedOption.value === "option1") {
      navigate("/accountinformation");
    } else if (selectedOption.value === "option2") {
      navigate("/signin");
    }
  };

  // Handle previous image navigation
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imagePaths.length - 1 : prevIndex - 1
    );
  };

  // Handle next image navigation
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imagePaths.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => prevZoom + 0.1);
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(0.1, prevZoom - 0.1));
  };

  return (
    <>
      <Helmet>
        <title>BitBusters</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="relative">
        <div className="flex md:flex-col justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">
          <Sidebar1 className="flex flex-col h-[1000px] gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
          <div className="flex justify-center w-full md:w-full ml-[300px]" style={{ minWidth: '1410px', minHeight: '968px', overflow: 'hidden', position: 'relative' }}>
            <div className="flex flex-col items-start w-full ">
              <div className="md:p-5 bg-white-A700 rounded-[30px] relative overflow-hidden" style={{ width: "50%", marginLeft: "15%", marginRight: "auto", marginTop: "140px", height: "600px", boxShadow: "0px 0px 0px 5px rgba(0, 0, 0, 1.5)" }}>
                <div className="relative" style={{ transform: `scale(${zoomLevel})`, transition: "transform 0.2s ease-in-out", width: "100%", height: "100%" }}>
                  <a href={imagePaths[currentImageIndex]} target="_blank" rel="noopener noreferrer">
                    <Img
                      src={imagePaths[currentImageIndex]}
                      alt={`image_${currentImageIndex}`}
                      className="object-cover rounded-[0px]"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
                <PipeInfoBox pipeNumber={currentImageIndex + 1} result="Pass" />
              </div>
              <div className="flex justify-center items-center w-[91%] md:w-full mt-[18px] ml-[-70px] gap-2">
                <Button
                  color="gray_900_e5"
                  size="sm"
                  rightIcon={<Img src="images/img_creditcardoff.svg" alt="credit_card_off" />}
                  className="gap-3 sm:px-5 min-w-[264px] rounded-[32px] hover:bg-gray-500 transition-colors duration-300"
                >
                  Deny Image
                </Button>
                <Button
                  color="green_400"
                  size="sm"
                  rightIcon={<Img src="images/img_cached.svg" alt="cached" />}
                  className="gap-3 sm:px-5 min-w-[264px] rounded-[32px] hover:bg-green-900 transition-colors duration-300"
                >
                  Generate Report
                </Button>
              </div>
              <div className="items-start w-[95%] md:w-full mt-[30px] ml-40 gap-5 md:ml-0">
                <TextArea
                  shape="round"
                  name="singleinput_one"
                  placeholder={`Comments...`}
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
        <div className="flex justify-end items-start gap-[2px] absolute top-4 right-4">
          <DropdownMenu options={dropDownOptions} onChange={handleOptionChange} />
        </div>
      </div>
    </>
  );
};

export default ImageDisplayPage;
