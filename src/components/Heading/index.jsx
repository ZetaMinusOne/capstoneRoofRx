import React from "react";

const sizes = {
  xl: "text-[40px] font-bold leading-[53px] md:text-[38px] sm:text-4xl",
  s: "text-[15px] font-semibold leading-[19px]",
  md: "text-base font-black leading-5",
  xs: "text-xs font-bold leading-[18px]",
  lg: "text-[28px] font-semibold leading-[136.02%] md:text-[26px] sm:text-2xl",
};

const Heading = ({ children, className = "", size = "xs", as, ...restProps }) => {
  const Component = as || "h6";

  return (
    <Component className={`text-indigo-700 font-poppins ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };
