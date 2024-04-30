import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Heading, Button, Input, Text, Img } from "../components";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/TextBoxInput";

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
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin checkbox
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const newValue = e.target.value;
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
    setFirstName(newValue);

    if (newValue.length > 20) {
      setFirstNameError("First name should not exceed 20 characters.");
    } else {
      setFirstNameError("");
    }
  };

  const handleLastNameChange = (e) => {
    const newValue = e.target.value;
    setLastName(newValue);

    if (newValue.length > 30) {
      setLastNameError("Last name should not exceed 30 characters.");
    } else {
      setLastNameError("");
    }
  };

  const handleSignIn = () => {
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

    if (firstName.length > 20) {
      setFirstNameError("First name should not exceed 20 characters.");
      isValid = false;
    }

    if (lastName.length > 30) {
      setLastNameError("Last name should not exceed 30 characters.");
      isValid = false;
    }

    if (isValid) {
      const requestData = {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        isAdmin // Include isAdmin in the request data
      };
  
      console.log("Data to be sent:", requestData); // Log the data before making the request
  
      fetch('https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/YOUR_STAGE/YOUR_RESOURCE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        navigate("/signin");
      })
      .catch(error => {
        console.error('Error:', error);
      });
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

// // try {
//   const signUpResponse = await Auth.confirmSignUp(email, verificationToken);
//   console.log('Sign-up confirmation successful:', signUpResponse);
//   // Redirect the user to a success page or perform any necessary actions
// } catch (error) {
//   console.error('Error confirming sign-up:', error);
//   // Handle the error, such as displaying an error message to the user
// }

  return (
    <>
      <Helmet>
        <title>BitBusters</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="w-full p-[0px] sm:p-5 bg-white-A700">
        <div className="flex md:flex-col justify-between items-start w-full mb-0 gap-0 mx-auto max-w-[1325px]">
          <div className="h-[1100px] w-[80%] relative overflow-hidden" style={{ marginLeft: '-300px' }}>
            <div className="justify-center h-[1200px] w-full left-0 bottom-0 right-0 top-0 m-auto absolute bg-gray-800" />
            <div className="justify-center h-[1200px] w-full left-0 bottom-0 right-0 top-0 m-auto absolute">
              <Img
                src="images/img_image_1.png"
                alt="imageone_one"
                className="h-[1200px] w-full md:h-auto object-cover"
                style={{ marginLeft: 0 }}
              />
              <div className="flex flex-col items-end gap-[25px]" style={{ position: 'absolute', left: '5%', top: '5%' }}>
                <Heading size="xl" as="h1" className="!text-white-A700 tracking-[-0.40px] !font-dmsans">
                  Welcome to “BitBusters”!
                </Heading>
                <Text size="s" as="p" className="mr-[66px] md:mr-0 !text-white-A700 !font-inter">
                  About this page{" "}
                </Text>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-[40%] md:w-full mt-[40px] gap-12 md:p-5" style={{ marginLeft: '150px' }}>
            <div className="flex flex-col self-stretch gap-7">
              <Text as="p" className="!text-gray-900_01 !font-medium">
                Account info
              </Text>
              <div className="flex sm:flex-col gap-5">
                <div className="flex flex-col w-full sm:w-full gap-[9px]">
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
                <div className="flex flex-col w-full sm:w-full gap-[9px]">
                  <Heading as="h3" className="uppercase">
                    Last Name{" "}
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
              <div className="flex sm:flex-col gap-5">
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
                <div className="flex flex-col w-full sm:w-full gap-[9px]">
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
              <div className="flex flex-col gap-[9px]">
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
                Admin
              </Heading>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <Text size="xs" className="text-xs ml-2">Check if admin</Text>
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
                  className="!text-blue_gray-700 !font-inter text-center hover:text-blue-900 cursor-pointer bg-transparent hover:underline focus:outline-none"
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
