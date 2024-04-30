import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "../components";
import Sidebar1 from "../components/SideBar";
import { useNavigate,useLocation } from "react-router-dom";
import DropdownMenu from "../components/DropDown";

const dropDownOptions = [
  { label: "Personal Info", value: "option1" },
  { label: "Sign-out", value: "option2" },
];

export default function MainpagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;


  const handleOptionChange = (selectedOption) => {
    if (selectedOption.value === "option1") {
      navigate("/accountinformation", { state: { isAdmin } });
    } else if (selectedOption.value === "option2") {
      navigate("/signin");
    }
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
      <div className="flex md:flex-col justify-between items-start w-full pr-8 gap-5 sm:pr-5 ">
      <Sidebar1 isAdmin={isAdmin} className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
        <div className="flex justify-center w-full md:w-full ml-[300px] ">
          <div className="flex flex-col  gap-7 justify-center w-[100%] md:w-full">
            <div className="flex md:flex-col justify-end items-start ml-[738px] gap-[23px] md:ml-0 relative">
              <div className="flex justify-end w-[100%] md:w-full items-start gap-[2px] absolute top-0 right-0">
                <DropdownMenu />
              </div>
            </div>
            <div className="flex md:flex-col w-[88%] md:w-full justify-center items-center gap-[198px]" style={{ marginTop: '200px' }}>
              <div className="flex flex-col w-full md:p-5 rounded-[20px]" style={{ marginBottom: '150px' }}>
                <Button
                  size="lg"
                  className="h-[401px] leading-4 min-w-[401px] rounded-[20px] dark_navy_blue hover:bg-blue-400 focus:outline-none focus:bg-blue-900"
                  onClick={() => {
                    navigate("/manageinspectors", { state: { isAdmin } });  
                  }}
                >
                  Manage Inspectors
                </Button>
              </div>
              <div
                className="flex flex-col w-full md:p-5 rounded-[20px]"
                style={{ marginBottom: '150px', boxShadow: 'none', backgroundColor: 'transparent' }}
              >
                <Button
                  size="lg"
                  className="h-[401px] leading-4 min-w-[401px] rounded-[20px] dark_navy_blue hover:bg-blue-400 focus:outline-none focus:bg-blue-900"
                  onClick={() => {
                    navigate("/reportgeneration", { state: { isAdmin } });                    
                  }}
                >
                  Start New Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
