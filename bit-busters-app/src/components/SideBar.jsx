import React, { useState } from "react";
import { Img } from ".";
import { Menu, Sidebar } from "react-pro-sidebar";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar1({ isAdmin, ...props }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to toggle sidebar collapse state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleButtonHover = (e, isHovered) => {
    e.currentTarget.style.filter = isHovered ? "brightness(20%)" : "brightness(100%)";
  };

  return (
    <Sidebar
      {...props}
      width="220px !important"
      collapsedWidth="80px !important"
      collapsed={collapsed}
      style={{ textAlign: "left" }}
    >
      <div className="flex items-center justify-center w-full h-[64px]">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="focus:outline-none"
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            <Img
              src="/images/img_menu_google.svg"
              alt="menu"
              className="h-[30px] "
            />
          </button>
        </div>
        <div className="flex items-center">
          {!collapsed && <div className="ml-1 text-white"></div>}
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
    if (isAdmin) {
      console.log("Admin Home clicked");
      navigate("/adminhome", { state: { isAdmin } });
    } else {
      console.log("Home clicked");
      navigate("/home", { state: { isAdmin } });
    }
  }}
  style={{ color: "white" }}
  onMouseEnter={(e) => handleButtonHover(e, true)}
  onMouseLeave={(e) => handleButtonHover(e, false)}
>
  <Img
    src="/images/img_home_google.svg"
    alt="home"
    className="h-[30px] w-[30px]"
  />
  {!collapsed && (
    <div className={`ml-2 whitespace-nowrap text-white`}>
      {isAdmin ? "Admin Home" : "Home Page"}
    </div>
  )}
</button>

          </div>
          <div className="flex items-center justify-between p-5 border-blue_gray-700_b2 border-b border-solid">
                <button
                className="flex items-center"
                onClick={() => {
                  console.log("History clicked");
                  if (isAdmin) {
                    navigate("/adminhistory", { state: { isAdmin } });
                  } else {
                    navigate("/history", { state: { isAdmin } });
                  }
                }}
                style={{ color: "white" }}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
              >
                <Img
                  src="/images/img_history_google.svg"
                  alt="document_one"
                  className="h-[30px] w-[30px]"
                />
                {!collapsed && (
                  <div className={`ml-2 whitespace-nowrap text-white`}>
                    History Of Reports
                  </div>
                )}
              </button>

          </div>
          {isAdmin && (
            <div className="flex items-center justify-between p-5 border-blue_gray-700_b2 border-b border-solid">
              <button
                className="flex items-center"
                onClick={() => {
                  console.log("Inspectors clicked");
                  navigate("/manageinspectors", { state: { isAdmin } });
                }}
                style={{ color: "white" }}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
              >
                <Img
                  src="/images/img_manage_google.svg"
                  alt="tools_one"
                  className="h-[30px] w-[30px]"
                />
                {!collapsed && (
                  <div className={`ml-2 whitespace-nowrap text-white`}>
                    Manage Inspectors
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </Menu>
    </Sidebar>
  );
}
