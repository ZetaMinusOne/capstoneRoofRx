import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Heading, Button, Text, Img } from "../components";
import { useNavigate } from 'react-router-dom';
import CustomInput from "../components/TextBoxInput";

export default function LandingpagePage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const newValue = e.target.value;
    setEmail(newValue);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    const newValue = e.target.value;
    setPassword(newValue);
    setPasswordError("");
  };

  const handleSignIn = () => {
    // Log a message indicating that authentication is being attempted
    console.log("Attempting to sign in...");

    // Mocking authentication process
    if (email === "test@example.com" && password === "password") {
      // If email and password match, simulate successful sign-in
      console.log("Authentication successful!");
      navigate("/home");
    } else {
      // If email or password is incorrect, show error message and log the attempt
      console.log("Authentication failed. Incorrect email or password.");
      setPasswordError("Incorrect email or password. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    // Check if the email is valid
    if (validateEmail(email)) {
      // Navigate to the forgot password page
      navigate("/resetpassword");
    } else {
      // If the email is not valid, show an error message
      setEmailError("Please enter a valid email address.");
    }
  };

  const validateEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <Helmet>
        <title>BitBusters</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex md:flex-col justify-end w-full pb-7 sm:pb-5 overflow-auto bg-white-A700">
        <div className="h-[950px] w-full mt-[0px] mb-[0px] relative">
          <div className="justify-center h-[1200px] w-full left-0 bottom-0 right-0 top-0 m-auto border-gray-200 border-r-[0.5px] border-solid bg-gray-800 absolute" />
          <div className="justify-center h-[1200px] w-full left-0 bottom-0 right-0 top-0 m-auto absolute">
            <Img
              src="images/img_image_1.png"
              alt="imageone_one"
              className="justify-center h-[1200px] w-full md:h-auto left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
            />
            <div className="flex flex-col items-end gap-[25px] left-[7%] top-[14%] m-auto absolute">
              <Heading size="xl" as="h1" className="!text-white-A700 tracking-[-0.40px] !font-dmsans">
                Welcome to “Bit Buster”!
              </Heading>
              <Text size="s" as="p" className="mr-[66px] md:mr-0 !text-white-A700 !font-inter">
                About this page{" "}
              </Text>
            </div>
          </div>
        </div>
        <div className="w-full md:p-5">
          <div className="flex flex-col items-center justify-end px-14 py-[201px] md:p-5">
            <div className="flex flex-col items-center w-[50%] md:w-full mt-[60px] gap-[25px]">
              <div className="flex justify-center">
                <Heading size="lg" as="h2" className="!text-blue_gray-900">
                  Welcome back!
                </Heading>
              </div>
              <div className="flex flex-col self-stretch pb-2 gap-[15px] px-2">
                <div className="flex flex-col gap-[9px]">
                  <Heading as="h3" className="uppercase">
                    Email
                  </Heading>
                  <CustomInput
                    size="sm"
                    shape="round"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={`Example@email.com`}
                    className="sm:pr-5 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
                  />
                  {emailError && <Text size="xs" className="text-red-500">{emailError}</Text>}
                </div>
                <div className="flex flex-col pb-1 gap-[9px]">
                  <Heading as="h4" className="uppercase">
                    Password
                  </Heading>
                  <CustomInput
                    shape="round"
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder={`Enter your password`}
                    className="sm:pr-5 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
                  />
                  {passwordError && <Text size="xs" className="text-red-500">{passwordError}</Text>}
                </div>
                <Button
                  shape="round"
                  size="xsm"
                  className="w-full sm:px-5 bg-blue-500 text-white rounded-md py-2 focus:outline-none hover:bg-blue-600"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div className="flex justify-center mt-[40px] p-[11px]">
              <Button
                className="self-end !text-blue_gray-700 !font-inter text-center hover:text-blue-900 bg-transparent hover:underline focus:outline-none"
                onClick={handleForgotPassword}
              >
                <span className="text-gray-600 font-poppins">Forgot your password?</span>
              </Button>
            </div>
            <div className="flex justify-center ">
              <Button
                className="!text-blue_gray-700 !font-inter text-center hover:text-blue-900 cursor-pointer bg-transparent hover:underline focus:outline-none"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Don’t have an account? Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
