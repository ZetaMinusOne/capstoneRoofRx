import React, { useState } from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-[5px]",
};
const variants = {
  tarOutlineBlack900: "border-black-900 border-2 border-solid",
};
const sizes = {
  xs: "h-[135px] w-[900px] p-4 text-sm",
};

const TextArea = React.forwardRef(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      shape,
      size = "xs",
      variant = "tarOutlineBlack900",
      onChange,
      maxLength = 255,
      ...restProps
    },
    ref,
  ) => {
    const [charCount, setCharCount] = useState(0);

    const handleChange = (e) => {
      const value = e.target.value;
      setCharCount(value.length);
      if (onChange) onChange(value);
    };

    return (
      <div className="relative">
        <div className="relative">
          <textarea
            ref={ref}
            className={`${className} ${(shape && shapes[shape]) || ""} ${
              sizes[size] || ""
            } ${variants[variant] || ""}`}
            name={name}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
            {...restProps}
          />
          <div
            className="absolute left-[730px] bottom-2 right-0 text-gray-500 text-xs pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {charCount}/{maxLength} characters
          </div>
        </div>
      </div>
    );
  }
);

TextArea.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["xs"]),
  variant: PropTypes.oneOf(["tarOutlineBlack900"]),
  maxLength: PropTypes.number,
};

export { TextArea };
