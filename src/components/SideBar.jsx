import React, { useState, useEffect } from "react";
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

  // Function to check if the current path matches the provided path
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Function to handle navigation with warning
  const handleNavigation = (path) => {
    if ((location.pathname === "/analyzeimages" || location.pathname === "/reportgenerated") && path !== location.pathname) {
      const confirmNavigation = window.confirm("Warning: You are leaving this page. Any unsaved information will be lost. Are you sure you want to continue?");
      if (!confirmNavigation) {
        return;
      }
    }
    navigate(path, { state: { isAdmin } });
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (location.pathname === "/analyzeimages" || location.pathname === "/reportgenerated") {
        event.preventDefault();
        event.returnValue = "";
        return "Warning: You are leaving this page. Any unsaved information will be lost. Are you sure you want to continue?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname]);

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
          <div className={`flex items-center justify-between p-5 border-blue_gray-700_b2 border-b border-solid ${isActive('/adminhome') ? 'bg-gray-800' : ''}${isActive('/home') ? 'bg-gray-800' : ''}`}>
            <button
              className="flex items-center"
              onClick={() => handleNavigation(isAdmin ? "/adminhome" : "/home")}
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
                  Home
                </div>
              )}
            </button>
          </div>
          <div className={`flex items-center justify-between p-5 border-blue_gray-700_b2 border-b border-solid ${isActive('/adminhistory') ? 'bg-gray-800' : ''}${isActive('/history') ? 'bg-gray-800' : ''}`}>
            <button
              className="flex items-center"
              onClick={() => handleNavigation(isAdmin ? "/adminhistory" : "/history")}
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
            <div className={`flex items-center justify-between p-5 border-blue_gray-700_b2 border-b border-solid ${isActive('/manageinspectors') ? 'bg-gray-800' : ''}`}>
              <button
                className="flex items-center"
                onClick={() => handleNavigation("/manageinspectors")}
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
