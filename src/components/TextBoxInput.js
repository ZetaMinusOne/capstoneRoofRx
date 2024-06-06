import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const CustomInput = ({ type, className, ...rest }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isChromeOrFirefox = () => {
    const isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
    const isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;
    return isChrome || isFirefox;
  };

  const isNotEdge = () => {
    return !navigator.userAgent.includes("Edg");
  };

  return (
    <div className="relative">
      <input
        {...rest}
        type={showPassword ? "text" : type} // Override type to "text" when password visibility is toggled
        className={`sm:pr-5 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md ${className}`}
        style={{
          fontFamily: "Roboto, sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          lineHeight: "1.75",
          letterSpacing: "0.00938em",
          width: "100%",
          maxWidth: "700px", // Adjust maximum width as needed
          color: "#202124",
          border: `1px solid ${isHovered || isFocused ? "#2563EB" : "#d7d7d7"}`, // Change border color on hover or focus
          borderRadius: "4px",
          padding: "10px 40px 10px 14px", // Increased padding to accommodate the eye icons
          marginBottom: "16px",
          boxSizing: "border-box",
          transition: "border-color 0.3s, box-shadow 0.3s", // Add transition for border color and box shadow
          boxShadow: isHovered || isFocused ? "0 0 0 3px rgba(66, 153, 225, 0.5)" : "none" // Add box shadow on hover or focus
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {type === "password" && isChromeOrFirefox() && isNotEdge() && ( // Render button only for password type input in Chrome and Firefox, excluding Edge
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 flex items-center"
          onClick={togglePasswordVisibility}
          style={{ cursor: "pointer" }}
        >
          {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />} {/* Show eye icon based on password visibility state */}
        </button>
      )}
    </div>
  );
};

export default CustomInput;
