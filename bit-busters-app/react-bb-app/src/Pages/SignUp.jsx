import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Heading, Button, Text, Img } from "../components";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/TextBoxInput";
import { Amplify } from 'aws-amplify';
import { confirmSignUp, signUp, resendSignUpCode  } from 'aws-amplify/auth';
import config from '../amplifyconfiguration.json';
Amplify.configure(config);


export default function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e) => {
    const newValue = e.target.value.trim();
    const restrictedCharsRegex = /[!#$%&*\/=?^`{|}~\s]/;
    if (restrictedCharsRegex.test(newValue)) {
      setEmailError("Email cannot contain special characters or whitespace.");
      return;
    }
    if (newValue.length > 50) {
      setEmailError("Email cannot be more than 50 characters.");
      return;
    }
    setEmail(newValue);
    setEmailError("");
  };

  const handlePasswordChange = (e, maxLength) => {
    const newValue = e.target.value;
    const truncatedValue = newValue.slice(0, maxLength);
    setPassword(truncatedValue);
    setPasswordError("");
    setIsLengthValid(truncatedValue.length >= 8);
    setHasUppercase(/[A-Z]/.test(truncatedValue));
    setHasLowercase(/[a-z]/.test(truncatedValue));
    setHasNumber(/[0-9]/.test(truncatedValue));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(truncatedValue));
    if (newValue.length > maxLength) {
      setPasswordError(`Password must be ${maxLength} characters or less.`);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newValue = e.target.value;
    setConfirmPassword(newValue);
    setConfirmPasswordError("");
  };

  const handlePhoneNumberChange = (e) => {
    const newValue = e.target.value;
    if (/^[\d+\-]*$/.test(newValue)) {
      setPhoneNumber(newValue);
      setPhoneNumberError("");
    } else {
      setPhoneNumberError("Phone number should only contain numbers.");
    }
  };

  const handleFirstNameChange = (e) => {
    const newValue = e.target.value;
    if (/\d/.test(newValue)) {
      setFirstNameError("First name cannot contain numbers.");
    } else if (newValue.length > 20) {
      setFirstNameError("First name should not exceed 20 characters.");
    } else {
      setFirstName(newValue);
      setFirstNameError("");
    }
  };

  const handleLastNameChange = (e) => {
    const newValue = e.target.value;
    if (/\d/.test(newValue)) {
      setLastNameError("Last name cannot contain numbers.");
    } else if (newValue.length > 30) {
      setLastNameError("Last name should not exceed 30 characters.");
    } else {
      setLastName(newValue);
      setLastNameError("");
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  // const handleOutsideClick = () => {
  //   setShowPopup(false);
  // };

  const handleSignIn = async () => {
    let isValid = true;
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }
    if (!isLengthValid || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      setPasswordError("Password must meet all criteria.");
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneNumberError("Please enter a valid phone number.");
      isValid = false;
    }
    if (firstName.length === 0) {
      setFirstNameError("First name is required.");
      isValid = false;
    } else if (firstName.length > 20) {
      setFirstNameError("First name should not exceed 20 characters.");
      isValid = false;
    } else if (/\d/.test(firstName)) {
      setFirstNameError("First name cannot contain numbers.");
      isValid = false;
    }
    if (lastName.length === 0) {
      setLastNameError("Last name is required.");
      isValid = false;
    } else if (lastName.length > 30) {
      setLastNameError("Last name should not exceed 30 characters.");
      isValid = false;
    } else if (/\d/.test(lastName)) {
      setLastNameError("Last name cannot contain numbers.");
      isValid = false;
    }
    if (isValid) {
      setShowPopup(true);
      const requestData = {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        isAdmin // Include isAdmin in the request data
      };
      try {
        const signUpResponse = await signUp({
          username: requestData.email,
          password: requestData.password,
          userAttributes: {
            email: requestData.email,
            'custom:userType': requestData.isAdmin,
          },
        });
        const apiRequestData = {
          FirstName: requestData.firstName,
          LastName: requestData.lastName,
          Email: requestData.email,
          PhoneNumber: requestData.phoneNumber,
          u_Password: requestData.password,
        };
        const response = await fetch('https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(apiRequestData)
        });
        if (response.ok) {
          console.log('User data submitted successfully');
        }
        if (requestData.isAdmin) {
          const getUserResponse = await fetch(`https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/users?email=${requestData.email}`);
          
          if (getUserResponse.ok) {
            const userDataResponse = await getUserResponse.json();
            console.log("User Data Response:", userDataResponse);
            
            const userData = userDataResponse.user;
            console.log("User Data:", userData);
            
            const userId = userData.User_ID;
            console.log("User ID:", userId);
            
            if (userId) {
              
             
          
              // Perform the POST request for the admin endpoint
              const adminResponse = await fetch('https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/admin', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({User_ID: userId})
              });
              
              console.log("Admin Response:", adminResponse);
            } else {
              console.error("User ID not found in userData");
            }
          } else {
            console.error("Error fetching user data:", getUserResponse.status);
          }
        }
        
     
        
        else {
          // console.error('Error submitting user data');
        }
        console.log("Sign up response:", signUpResponse);
        setShowPopup(true);
      } catch (error) {
        console.error("Error signing up:", error);
      }

    }
  };



  const isValidEmail = (email) => {
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?\d{0,3}?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneNumberPattern.test(phoneNumber);
  };


  const handleResendVerificationCode = async (email) => {
    try {
      await resendSignUpCode({username: email});
      console.log('Verification code resent successfully');
      // Optionally, you can reset the verificationToken state and show a success message
      setVerificationToken('');
      setSuccessMessage('Verification code resent successfully. Please check your email.');
    } catch (error) {
      console.error('Error resending verification code:', error);
      setErrorMessage('Error resending verification code. Please try again.');
    }
  };


  const handleVerifySignup = async (email, verificationToken) => {
    try {
      const signUpResponse = await confirmSignUp({ username: email, confirmationCode: verificationToken });
      console.log('Sign-up confirmation successful:', signUpResponse);
      // Show success message and navigate to sign-in page after a short delay
      setSuccessMessage('Sign-up successful!');
      setTimeout(() => {
        navigate('/signin');
      }, 2000); // Delay of 2 seconds (2000 milliseconds)
    } catch (error) {
      console.error('Error confirming sign-up:', error);
      // Set the error message
      setErrorMessage('Invalid verification code. Please try again.');
    }

  };



 

  return (
    <>
      <Helmet>
        <title>BitBusters</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex md:flex-col justify-end w-full pb-7 sm:pb-5 overflow-auto bg-white-A700">
        <div className="h-[950px] w-full mt-[0px] mb-[90px] relative">
          <div className="justify-center h-[1300px] w-full left-0 bottom-0 right-0 top-0 m-auto border-gray-200 border-r-[0.5px] border-solid bg-gray-800 absolute" />
          <div className="justify-center h-[1300px] w-full left-0 bottom-0 right-0 top-0 m-auto absolute">
            <Img
              src="images/img_image_1.png"
              alt="imageone_one"
              className="justify-center self-stretch h-[1300px] w-full md:h-auto left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
            />
            <div className="flex flex-col  items-end gap-[25px] left-[7%] top-[14%] m-auto absolute">
              <Heading size="xl" as="h1" className="!text-white-A700 tracking-[-0.40px] !font-dmsans">
                Welcome to “Bit Buster”!
              </Heading>
              <Text size="s" as="p" className="mr-[66px] md:mr-0 !text-white-A700 !font-inter">
              </Text>
            </div>
          </div>
        </div>
        <div className="w-full md:p-5">
          <div className="flex flex-col items-center justify-end px-14 py-[10px] md:p-5">
            <div className="flex flex-col items-center w-[50%] md:w-full mt-[100px] gap-[25px]">
              <Text as="p" className="!text-gray-900_01 !font-medium">
                Account info
              </Text>
              <div className="flex sm:flex-col gap-5 self-stretch">
                <div className="flex flex-col  w-full sm:w-full gap-[9px]">
                  <Heading as="h2" className="uppercase">
                    Name
                  </Heading>
                  <CustomInput
                    shape="round"
                    type="text"
                    name="firstName"
                    placeholder={`Enter your first name`}
                    value={firstName}
                    onChange={handleFirstNameChange}
                    className="sm:pr-5 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
                  />
                  {firstNameError && <Text size="xs" className="text-red-500">{firstNameError}</Text>}
                </div>
                <div className="flex flex-col self-stretch w-full sm:w-full gap-[9px]">
                  <Heading as="h3" className="uppercase">
                    Last Name(s){" "}
                  </Heading>
                  <CustomInput
                    shape="round"
                    type="text"
                    name="lastName"
                    placeholder={`Enter your last name(s) `}
                    value={lastName}
                    onChange={handleLastNameChange}
                    className="sm:pr-5 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
                  />
                  {lastNameError && <Text size="xs" className="text-red-500">{lastNameError}</Text>}
                </div>
              </div>
              <div className="flex self-stretch sm:flex-col gap-5">
                <div className="flex flex-col w-full sm:w-full gap-[9px]">
                  <Heading as="h4" className="uppercase">
                    Phone
                  </Heading>
                  <CustomInput
                    shape="round"
                    type="text"
                    name="phone"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder={`Enter Phone Number`}
                    className="sm:pr-5 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
                  />
                  {phoneNumberError && <Text size="xs" className="text-red-500">{phoneNumberError}</Text>}
                </div>
                <div className="flex flex-col self-stretch w-full sm:w-full gap-[9px]">
                  <Heading as="h5" className="uppercase">
                    Email
                  </Heading>
                  <CustomInput
                    shape="round"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={`Enter Email`}
                    className="sm:pr-5 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
                  />
                  {emailError && <Text size="xs" className="text-red-500">{emailError}</Text>}
                </div>
              </div>
              <div className="flex flex-col self-stretch  gap-[9px]">
                <Heading as="h6" className="uppercase">
                  Password
                </Heading>
                <CustomInput
                  shape="round"
                  type="password"
                  name="password"
                  value={password}
                  placeholder={`Enter your password`}
                  onChange={(e) => handlePasswordChange(e, 20)} // Specify maximum length as 20
                  className="sm:pr-5 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
                />
                <div className="flex items-center">
                  {isLengthValid && <Checkmark />}
                  <Text size="xs" className="text-xs">Minimum length: 8 characters</Text>
                </div>
                <div className="flex items-center">
                  {hasUppercase && <Checkmark />}
                  <Text size="xs" className="text-xs">At least one uppercase letter</Text>
                </div>
                <div className="flex items-center">
                  {hasLowercase && <Checkmark />}
                  <Text size="xs" className="text-xs">At least one lowercase letter</Text>
                </div>
                <div className="flex items-center">
                  {hasNumber && <Checkmark />}
                  <Text size="xs" className="text-xs">At least one number</Text>
                </div>
                <div className="flex items-center">
                  {hasSpecialChar && <Checkmark />}
                  <Text size="xs" className="text-xs">Special characters: !@#$%^&*(),.?":{}|&lt;&gt;</Text>
                </div>
                {passwordError && <Text size="xs" className="text-red-500">{passwordError}</Text>}
              </div>
            
            <div className="flex flex-col self-stretch gap-[9px]">
              <Heading as="p" className="uppercase">
                Confirm Password
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
            <div className="flex flex-col self-stretch gap-[9px]">
              <Heading as="p" className="uppercase">
              Supervisor 
              </Heading>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <Text size="xs" className="text-xs ml-2">Check if Supervisor </Text>
              </div>
            </div>
            <div className="self-stretch h-px w-full bg-black-900" />
            <Button
              shape="round"
              size="xs"
              className="sm:px-5 min-w-[230px] bg-blue-500 text-white rounded-md py-2 focus:outline-none hover:bg-blue-600"
              onClick={handleSignIn}
            >
              Sign Up
            </Button>
            <div className="flex justify-end">
              <div className="flex justify-center mt-[-30px]">
                <Button
                  className="!text-blue_gray-700 !font-inter mt-4 text-center hover:text-blue-900 cursor-pointer bg-transparent hover:underline focus:outline-none"
                  onClick={() => {
                    navigate("/signin")
                  }}
                >
                  Already have an account? Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Popup for confirming sign up */}
      {showPopup && (
  <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center bg-white bg-opacity-90" >
    <div className="rounded-lg shadow-lg p-6" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem' }}>
      <p className="text-center">Please check your email for the verification code.</p>
      <div>
        <input
          type="text"
          placeholder="Verification Code"
          value={verificationToken}
          onChange={(e) => setVerificationToken(e.target.value)}
          className="border border-gray-100 rounded-md px-3 py-2 mt-4 block w-full"
          style={{ borderWidth: '2px', borderRadius: '0.7rem', padding: '10px 20px' }}        />
      </div>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      <div className="flex justify-center mt-4">
      <button
    onClick={() => handleVerifySignup(email, verificationToken)}
    className="mr-4 bg-green-600 text-white font-bold rounded-md px-4 py-2 hover:bg-green-800 focus:outline-none !important"
    style={{ color: '#ffffff' }} // Inline style to set text color to white

      >
          Confirm Sign Up
      </button>



      <Button
        onClick={() => handleResendVerificationCode(email)}
        className="mr-4 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none"
      >
        Resend Verification Code
      </Button>
      <Button
        onClick={handleCancel}
        className="bg-red-500 text-gray-800 rounded-md px-4 py-2 hover:bg-red-700 focus:outline-none"
      >
        Cancel
      </Button>
      </div>
    </div>
  </div>
  
      )}
      {/* Test button to simulate showing the popup */}
      {/* <Button onClick={testShowPopup}>Test Show Popup</Button> */}
    </>
  );
}

function Checkmark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M17.707 4.293a1 1 0 0 1 1.414 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L7 14.586l10.293-10.293a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
    </svg>
  );
}