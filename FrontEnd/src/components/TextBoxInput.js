// Input.js
import React, { useState } from "react";

const CustomInput = ({ className, ...rest }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <input
      {...rest}
      className={`sm:pr-5 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md ${className}`}
      style={{
        fontFamily: "Roboto, sans-serif",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "1",
        letterSpacing: "0.00938em",
        width: "100%",
        maxWidth: "700px", // Adjust maximum width as needed
        color: "#202124",
        border: `0.5px ${isHovered ? "#2563EB" : "border-gray-300"}`, // Change border color on hover
        borderRadius: "4px",
        padding: "10px 14px",
        marginBottom: "16px",
        boxSizing: "border-box",
        transition: "border-color 0.3s, box-shadow 0.3s", // Add transition for border color and box shadow
        boxShadow: isHovered ? "0 0 0 3px rgba(66, 153, 225, 0.5)" : "none" // Add box shadow on hover
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default CustomInput;
