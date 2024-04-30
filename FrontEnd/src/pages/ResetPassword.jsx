import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Heading, Text } from "../components";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/TextBoxInput";

export default function ResetPasswordPagePage() {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);

  const handlePasswordChange = (e, maxLength) => {
    const newValue = e.target.value;
    setPassword(newValue);
    setPasswordError("");

    // Check password validity after state update
    if (!isValidPassword(newValue)) {
      setPasswordError("");
    }

    // Check if password exceeds maximum length
    if (newValue.length > maxLength) {
      setPasswordError(`Password must be ${maxLength} characters or less.`);
    }

    // Check if both passwords are valid to enable update button
    setIsUpdateEnabled(isValidPassword(newValue) && isValidPassword(confirmPassword) && newValue === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newValue = e.target.value;
    setConfirmPassword(newValue);
    setConfirmPasswordError("");

    // Check password match after state update
    if (password !== newValue) {
      setConfirmPasswordError("Passwords do not match.");
    }

    // Check if both passwords are valid to enable update button
    setIsUpdateEnabled(isValidPassword(password) && isValidPassword(newValue) && password === newValue);
  };

  const navigate = useNavigate();

  const handleUpdatePassword = () => {
    // Handle Update Password button click here
    if (isUpdateEnabled) {
      navigate("/signin");
    }
  };

  return (
    <>
      <Helmet>
        <title>Pages</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex justify-end w-full pl-14 pr-[113px] py-[113px] md:p-5 bg-white-A700">
        <div className="flex flex-col items-center w-[68%] md:w-full mb-[72px] mr-[249px] pb-[118px] gap-16 md:pb-5 md:mr-0 sm:gap-8">
          <div className="self-stretch px-8 sm:px-5">
            <div className="flex flex-col w-full pb-[111px] gap-12 mx-auto md:pb-5 max-w-[634px]">
              <div className="flex flex-col gap-7">
                <Text size="xs" as="p" className="!text-gray-900">
                  Password Reset
                </Text>
                <div className="flex flex-col gap-[9px]">
                  <Heading as="h1" className="!text-black-900 uppercase">
                    Key
                  </Heading>
                  <CustomInput
                    shape="round"
                    name="singleinput_one"
                    placeholder={`Enter Key`}
                    className="sm:pr-3 border-1 border-gray-300 rounded-sm px-2 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
                  />
                </div>
                <div className="flex flex-col gap-[9px]">
                  <Heading as="h2" className="!text-black-900 uppercase">
                    New Password
                  </Heading>
                  <CustomInput
                    shape="round"
                    type="password"
                    name="password"
                    value={password}
                    placeholder={`Enter your new password`}
                    onChange={(e) => handlePasswordChange(e, 20)} // Specify maximum length as 20
                    className="sm:pr-5 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
                  />
                  
                  <PasswordRequirements password={password} />
                </div>
                {passwordError && <Text size="xs" className="text-red-500">{passwordError}</Text>}
                <div className="flex flex-col gap-[9px]">
                  <Heading as="h3" className="!text-black-900 uppercase">
                    Confirm New Password
                  </Heading>
                  <CustomInput
                    shape="round"
                    type="password"
                    name="confirmpassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder={`Re-enter your password`}
                    className="sm:pr-5 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
                  />
                  {confirmPasswordError && <Text size="xs" className="text-red-500">{confirmPasswordError}</Text>}
                </div>
              </div>
              <div className="h-px bg-gray-200" />
            </div>
          </div>
          <Button
            shape="round"
            className={`sm:px-5 font-dmsans min-w-[200px] mt-[-115px] ${isUpdateEnabled ? 'hover:bg-gray-800 hover:text-white' : 'cursor-not-allowed opacity-50'}`}
            onClick={handleUpdatePassword}
            disabled={!isUpdateEnabled}>
            Update Password
          </Button>
        </div>
      </div>
    </>
  );
}

function isValidPassword(password) {
  return password.length >= 8 && hasUppercase(password) && hasLowercase(password) && hasNumber(password) && hasSpecialChar(password);
}

function hasUppercase(password) {
  return /[A-Z]/.test(password);
}

function hasLowercase(password) {
  return /[a-z]/.test(password);
}

function hasNumber(password) {
  return /[0-9]/.test(password);
}

function hasSpecialChar(password) {
  return /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

function PasswordRequirements({ password }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <div className="flex items-center">
        {isValidPassword(password) && <Checkmark />}
        <Text size="xs">Minimum length: 8 characters</Text>
      </div>
      <div className="flex items-center">
        {hasUppercase(password) && <Checkmark />}
        <Text size="xs">At least one uppercase letter</Text>
      </div>
      <div className="flex items-center">
        {hasLowercase(password) && <Checkmark />}
        <Text size="xs">At least one lowercase letter</Text>
      </div>
      <div className="flex items-center">
        {hasNumber(password) && <Checkmark />}
        <Text size="xs">At least one number</Text>
      </div>
      <div className="flex items-center">
        {hasSpecialChar(password) && <Checkmark />}
        <Text size="xs">Special characters: !@#$%^&*(),.?":{}|&lt;&gt;</Text>
      </div>
    </div>
  );
}

function Checkmark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M17.707 4.293a1 1 0 0 1 1.414 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L7 14.586l10.293-10.293a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
    </svg>
  );
}
