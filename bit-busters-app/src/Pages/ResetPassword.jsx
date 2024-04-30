import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Heading, Text } from "../components";
import { useNavigate, useLocation } from "react-router-dom";
import CustomInput from "../components/TextBoxInput";
import { confirmResetPassword } from 'aws-amplify/auth';

export default function ResetPasswordPagePage() {
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  const location = useLocation();
  const { email } = location.state || {};

  const handleKeyChange = (e) => {
    const newValue = e.target.value.trim();
    setKey(newValue);
    setIsUpdateEnabled(newValue !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword);
  };

  const handlePasswordChange = (e) => {
    let newValue = e.target.value;
    let error = "";
    
    // Limit password length to 20 characters
    if (newValue.length > 20) {
      newValue = newValue.slice(0, 20);
      error = "Password cannot exceed 20 characters";
    } else {
      error = !isValidPassword(newValue) ? "Please complete the parameters" : "";
    }
    
    setPassword(newValue);
    setPasswordError(error);
    
    setIsUpdateEnabled(
      newValue.trim() !== "" &&
      newValue === confirmPassword &&
      key.trim() !== "" &&
      error === ""
    );
  };

  const handleConfirmPasswordChange = (e) => {
    const newValue = e.target.value;
    setConfirmPassword(newValue);
    setConfirmPasswordError("");
    if (password !== newValue) {
      setConfirmPasswordError("Passwords do not match.");
    }
    setIsUpdateEnabled(key.trim() !== "" && password.trim() !== "" && newValue.trim() !== "" && newValue === password);
  };

  const handleUpdatePassword = async () => {
    setLoading(true); // Set loading to true when sign-in starts

    try {
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match.");
        return; // Prevent further execution
      }
  
      // Validate the key
      if (!isValidKey(key)) {
        console.log("Invalid key:", key);
        setErrorMessage("Invalid key. Please provide a valid key.");
        setLoading(false); // Set loading to false when validation fails
        return; // Prevent further execution
      }
  
      // Validate the password
      if (!isValidPassword(password)) {
        console.log("Invalid password:", password);
        setPasswordError("Please complete the parameters");
        setLoading(false); // Set loading to false when validation fails
        return; // Prevent further execution
      }
  
      // Update the password with Cognito
      await confirmResetPassword({ username: email, confirmationCode: key, newPassword: password });
  
      // Password reset successful, navigate to sign-in page
      navigate("/signin");
    } catch (error) {
      console.error("Error updating password:", error.message);
      setLoading(false); // Set loading to false when validation fails
      setErrorMessage(error.message);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Pages</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex justify-end w-full pl-14 pr-[113px] py-[100px] md:p-5 bg-white-A700">
        <div className="flex flex-col items-center w-[68%] md:w-full mb-[72px] mr-[249px] pb-[100px] gap-0 md:pb-5 md:mr-0 sm:gap-8">
          <div className="self-stretch px-8 sm:px-5">
            <div className="flex flex-col w-full pb-[111px] gap-12 mx-auto md:pb-5 max-w-[634px]">
              <div className="flex flex-col gap-7">
                <Text size="s" as="p" className="!text-gray-900">
                  Password Reset 
                </Text>
                <Text size="xs" as="p" className="!text-gray-900">
                  Important: A password reset email has been sent to the email address associated with your account.
                </Text>
                <div className="flex flex-col gap-[9px]">
                  <Heading as="h1" className="!text-black-900 uppercase">
                    Key
                  </Heading>
                  <CustomInput
                    shape="round"
                    name="key"
                    value={key}
                    onChange={handleKeyChange}
                    placeholder={`Enter Key`}
                    className="sm:pr-3 border-1 border-gray-300 rounded-sm px-2 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
                  />
                  {key.trim() === "" && <Text size="xs" className="text-red-500">Please enter a valid key</Text>}
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
                    onChange={handlePasswordChange}
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
              {errorMessage && <Text size="xs" className="text-red-500">{errorMessage}</Text>}
              <div className="h-px bg-gray-200" />
            </div>
          </div>
          <Button
            shape="round"
            className={`sm:px-5 font-dmsans  min-w-[200px]   ${isUpdateEnabled ? 'hover:bg-gray-800 hover:text-white' : 'cursor-not-allowed opacity-50'}`}
            onClick={handleUpdatePassword}
            disabled={!isUpdateEnabled}>
            Update Password
          </Button>
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-100"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Utility functions and components
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

// Utility function to check if the key is valid
function isValidKey(key) {
  // Add your validation logic here, for example:
  return key.trim() !== ""; // Check if key is not empty
}
