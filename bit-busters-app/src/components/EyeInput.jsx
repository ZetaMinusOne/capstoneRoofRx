import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export const PasswordInput = ({ placeholder, handlePasswordChange, className }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <style>
        {`
          input[type="password"]::-ms-reveal {
            display: none;
          }
          `}
      </style>
      <div className="relative w-full border rounded pl-4">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          onChange={handlePasswordChange}
          className={`w-full h-[48px] pl-4 pr-10 ${className}`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 flex items-center h-[48px]"
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: 'pointer' }}
        >
          {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
        </button>
      </div>
    </>
  );
};
