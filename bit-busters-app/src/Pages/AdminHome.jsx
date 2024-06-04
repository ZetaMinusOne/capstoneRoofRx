import React, {useEffect} from "react";
import { Helmet } from "react-helmet";
import { Button } from "../components";
import Sidebar1 from "../components/SideBar";
import { useNavigate,useLocation } from "react-router-dom";
import DropdownMenu from "../components/DropDown";
import { useContext, } from "react";
import { reportGenerationContext } from "../components/Context";
import { ButtonGroup } from "@aws-amplify/ui-react";

// const dropDownOptions = [
//   { label: "Personal Info", value: "option1" },
//   { label: "Sign-out", value: "option2" },
// ];

export default function MainpagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;
  const { data, setValues } = useContext(reportGenerationContext); 

  // const handleOptionChange = (selectedOption) => {
  //   if (selectedOption.value === "option1") {
  //     navigate("/accountinformation", { state: { isAdmin } });
  //   } else if (selectedOption.value === "option2") {
  //     navigate("/signin");
  //   }
  // };
  const backgroundStyle = {
    backgroundColor: "",
    backgroundImage: ``,
    backgroundRepeat: "repeat",
    
  };

  const cleanData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    // dateVisited: "",
    zipcode: "",
    inspectorFirstName: "",
    inspectorPhoneNumber: "",
    inspectorEmail: "",
    comments: "",
    images: [],
    date: new Date().toLocaleDateString(), // Get current date
    pdfBase64: "",
    // pipe2: "not broken",
    // pipe3: "broken",
    brokenPipes: 10,
    price: 10,
    get total() {
      return this.price * this.brokenPipes;
    },
  }

  useEffect(() => {
    const savedData =  window.localStorage.getItem("data")
    const savedDataParse = savedData ? JSON.parse(savedData) : null;
    console.log("JSON.parse(savedData)",JSON.parse(savedData))
    console.log("savedDataParse",savedDataParse)
    if (data) setValues({...data, ...savedDataParse})
   //  console.log("data",data)
   }, [])
  
   useEffect(() => {
     window.localStorage.setItem("data", JSON.stringify(cleanData))
     console.log(JSON.stringify(cleanData))
   }, [data])

  return (
    <>
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 "style={backgroundStyle}>
      <div className="flex justify-end w-[100%] items-start gap-[2px] absolute top-0 right-0">
            <DropdownMenu />
        </div>
      <Sidebar1 isAdmin={isAdmin} className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
      
      <div className="flex justify-center w-full m-auto">
          {/* <div className="flex flex-col  gap-7 justify-center w-[100%] md:w-full"> */}
            {/* <div className="flex md:flex-col justify-end items-start ml-[738px] gap-[23px] md:ml-0 relative">
            </div> */}
            {/* <div className="flex md:flex-col w-[88%] md:w-full justify-center items-center gap-[198px]" style={{ marginTop: '200px' }}> */}
              {/* <div className="flex flex-col w-full md:p-5 rounded-[20px]" style={{ marginBottom: '150px' }}> */}
            {/* Vertical - Button Group 1 */}
            <ButtonGroup style={{ margin: "100px" }} vertical>
            <Button
                style={{ margin: "100px" }}
                size="lg"
                className="max-h-[401px] leading-4 w-full max-w-[401px] m-auto rounded-[20px] dark_navy_blue hover:bg-blue-500 focus:outline-none focus:bg-blue-900 shadow-md text-white font-bold"
                onClick={() => {
                  navigate("/reportgeneration", { state: { isAdmin  } });                    
                }}
                >
                Start New Report Pipes
              </Button>
              <Button
                  style={{ margin: "100px" }}
                  size="lg"
                  className="max-h-[401px] leading-4 w-full max-w-[401px] m-auto rounded-[20px] dark_navy_blue hover:bg-blue-500 focus:outline-none focus:bg-blue-900 shadow-md text-white font-bold"
                  onClick={() => {
                    navigate("/reportgenerationtiles", { state: { isAdmin } });
                  }}
                  >
                  Start New Report Tiles
                </Button>
            </ButtonGroup>
              
            <ButtonGroup style={{ margin: "100px" }} vertical>
                <Button
                  style={{ margin: "100px" }}
                  size="lg"
                  className="max-h-[401px] leading-4 w-full max-w-[401px] m-auto rounded-[20px] dark_navy_blue hover:bg-blue-500 focus:outline-none focus:bg-blue-900 shadow-md text-white font-bold"
                  onClick={() => {
                    navigate("/reportgenerationshingles", { state: { isAdmin } });
                  }}
                  >
                  Start New Report Shingles
                </Button>
                <Button
                  style={{ margin: "100px" }}
                  size="lg"
                  className="max-h-[401px] leading-4 w-full max-w-[401px] m-auto rounded-[20px] dark_navy_blue hover:bg-blue-500 focus:outline-none focus:bg-blue-900 shadow-md text-white font-bold"
                  onClick={() => {
                    navigate("/manageinspectors", { state: { isAdmin } });  
                  }}
                >
                  Manage Inspectors
                </Button>
              </ButtonGroup>
              {/* <div */}
                {/* className="flex flex-col w-full md:p-5 rounded-[20px]"
                style={{ marginBottom: '150px', boxShadow: 'none', backgroundColor: 'transparent' }}
              > */}
                  </div>
                  
              {/* </div> */}
            {/* </div> */}
          {/* </div> */}
        {/* </div> */}
      </div>
      
      
    </>
  );
}
