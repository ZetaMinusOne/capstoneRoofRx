import React from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-[24px]",
};
const variants = {
  fill: {
    gray_900_e5: "bg-gray-900_e5 text-gray-50",
    green_400: "bg-green-400 text-gray-50",
    indigo_700: "bg-indigo-700 text-white-A700",
    green_500: "bg-green-400 text-white-A700",
  },
};
const sizes = {
  lg: "h-[495px] px-[35px] text-xl",
  sm: "h-[65px] px-[35px] text-xl",
  xs: "h-[48px] px-6 text-base",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "xs",
  color = "indigo_700",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex items-center justify-center text-center cursor-pointer font-bold ${(shape && shapes[shape]) || ""} ${(size && sizes[size]) || ""} ${(variant && variants[variant]?.[color]) || ""}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["sm", "xs"]),
  variant: PropTypes.oneOf(["fill"]),
  color: PropTypes.oneOf(["gray_900_e5", "green_400", "indigo_700"]),
};

export { Button };
