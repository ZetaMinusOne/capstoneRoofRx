import React, { useState } from "react";
import { Img } from ".";
import { Menu, Sidebar } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom"
export default function Sidebar1({ ...props }) {
  const [collapsed, setCollapsed] = useState(false);

  // Function to toggle sidebar collapse state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleHover = (e) => {
    e.target.parentElement.style.filter = "brightness(20%)";
  };

  const handleLeave = (e) => {
    e.target.parentElement.style.filter = "brightness(100%)";
  };

  const navigate = useNavigate();
  return (
    <Sidebar
      {...props}
      width="220px !important" // Adjust the width of the sidebar
      collapsedWidth="80px !important"
      collapsed={collapsed}
      style={{ textAlign: "left" }} // Align text to the left
    >
      <div className="flex items-center justify-center w-full h-[64px]">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <Img
              src="images/img_company_profile.svg"
              alt="companyprofile"
              className="h-[64px]"
              style={{ filter: "brightness(100%)" }} // Default brightness
              onMouseEnter={handleHover} // Darken on hover
              onMouseLeave={handleLeave} // Restore on mouse leave
            />
          </button>
        </div>
        <div className="flex items-center">
          {!collapsed && (
            <div className="ml-1 text-white"></div>
          )}
        </div>
      </div>
      <Menu
        menuItemStyles={{
          button: {
            padding: " ",
            margin: " ",
            textAlign: "left",
          },
        }}
        rootStyles={{ "&>ul": { gap: "728px" } }}
        className="flex flex-col w-full mb-[5px]"
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-5 border-blue_gray-700_b2 border-b border-solid">
            <button
              className="flex items-center"
              onClick={() => {
                console.log("Home clicked")
                navigate("/home")
              }}
              style={{ color: "white" }} // Explicitly setting color to white
              onMouseEnter={handleHover} // Darken on hover
              onMouseLeave={handleLeave} // Restore on mouse leave
            >
              <Img
                src="images/img_home.svg"
                alt="home_one"
                className="h-[25px] w-[25px]"
                style={{ filter: "brightness(100%)" }} // Default brightness
              />
              {!collapsed && (
                <div
                  className={`ml-2 whitespace-nowrap text-white`}
                >
                  Home Page
                </div>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between p-5 border-blue_gray-700_b2 border-b border-solid">
            <button
              className="flex items-center"
              onClick={
                () => {
                  console.log("History clicked")
                  navigate("/history")
                }
              }
              style={{ color: "white" }} // Explicitly setting color to white
              onMouseEnter={handleHover} // Darken on hover
              onMouseLeave={handleLeave} // Restore on mouse leave
            >
              <Img
                src="images/img_document.svg"
                alt="document_one"
                className="h-[25px] w-[25px]"
                style={{ filter: "brightness(100%)" }} // Default brightness
              />
              {!collapsed && (
                <div
                  className={`ml-2 whitespace-nowrap text-white`}
                >
                  History Of Reports
                </div>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between p-5 border-blue_gray-700_b2 border-b border-solid">
            <button
              className="flex items-center"
              onClick={() => {
                console.log("Inspectors clicked")
                navigate("/manageinspectors")
              }
              }
              style={{ color: "white" }} // Explicitly setting color to white
              onMouseEnter={handleHover} // Darken on hover
              onMouseLeave={handleLeave} // Restore on mouse leave
            >
              <Img
                src="images/img_tools.svg"
                alt="tools_one"
                className="h-[25px] w-[25px]"
                style={{ filter: "brightness(100%)" }} // Default brightness
              />
              {!collapsed && (
                <div
                  className={`ml-2 whitespace-nowrap text-white`}
                >
                  Manage Inspectors
                </div>
              )}
            </button>
          </div>
        </div>
      </Menu>
    </Sidebar>
  );
}
