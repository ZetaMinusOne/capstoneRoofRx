import React from "react";
import Select, { components } from "react-select";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-lg",
  square: "rounded-[0px]",
};
const variants = {
  fill: {
    white_A700: "bg-white-A700 shadow-md text-black-900",
  },
};
const sizes = {
  xs: "h-[70px] w-[100px] ",
  sm: "h-[70px] w-[100px] ",
};


const SelectBox = React.forwardRef(
  (
    {
      children,
      className = "",
      options = [],
      isSearchable = false,
      isMulti = false,
      indicator,
      shape,
      variant = "dropdown0",
      size = "sm",
      color = "white_A700",
      ...restProps
    },
    ref,
  ) => {
    return (
      <>
        <Select
          ref={ref}
          options={options}
          className={`${className} flex ${(shape && shapes[shape]) || ""} ${(size && sizes[size]) || ""} ${(variant && variants[variant]?.[color]) || ""}`}
          isSearchable={isSearchable}
          isMulti={isMulti}
          components={{
            IndicatorSeparator: () => null,
            ...(indicator && { DropdownIndicator: () => indicator }),
          }}
          styles={{
            container: (provided) => ({
              ...provided,
              zIndex: 0,
              padding: "5px", // Increase padding for larger grey box
            }),
            control: (provided) => ({
              ...provided,
              backgroundColor: "#f5f5f5",
              border: "1px solid #0a192f", // Change border color to dark navy blue
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              minHeight: "auto",
              width: "100%",
              "&:hover": {
                border: "3px solid #999", // Change border color on hover
              },
            }),
            input: (provided) => ({
              ...provided,
              color: "#333",
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? "#32628d" : "transparent",
              color: state.isSelected ? "#ffffff" : "#333",
              "&:hover": {
                backgroundColor: "#32628d",
                color: "#ffffff",
              },
            }),
            valueContainer: (provided) => ({
              ...provided,
              padding: 0,
            }),
            placeholder: (provided) => ({
              ...provided,
              margin: 0,
            }),
            menuPortal: (base) => ({ ...base, zIndex: 999999 }),
          }}
          menuPortalTarget={document.body}
          closeMenuOnScroll={(event) => {
            return event.target.id === "scrollContainer";
          }}
          {...restProps}
        />
        {children}
      </>
    );
  },
);

SelectBox.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  isSearchable: PropTypes.bool,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  indicator: PropTypes.node,
  shape: PropTypes.oneOf(["round", "square"]),
  size: PropTypes.oneOf(["xs", "sm"]),
  variant: PropTypes.oneOf(["fill", "dropdown0"]),
  color: PropTypes.oneOf(["white_A700"]),
};

export { SelectBox };
