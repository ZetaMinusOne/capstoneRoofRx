import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Heading, Button, Text, Img } from "../components";
import { useNavigate } from 'react-router-dom';
import CustomInput from "../components/TextBoxInput";
import { Amplify } from 'aws-amplify';
import { signIn, resetPassword, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import config from '../amplifyconfiguration.json';

Amplify.configure(config);

export default function LandingpagePage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    verifyIfSignedIn(); // Call the function before rendering
  }, []);

  const handleEmailChange = (e) => {
    const newValue = e.target.value.trim();
    const restrictedCharsRegex = /[!#$%&*\/=?^`{|}~\s]/;
    if (restrictedCharsRegex.test(newValue)) {
      setEmailError("Email cannot contain special characters or whitespace.");
      return;
    }
    if (newValue.length > 50) {
      setEmailError("Email must be 50 characters or less.");
      return;
    }
    setEmail(newValue);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    const newValue = e.target.value;
    setPassword(newValue);
    setPasswordError("");
  };

  const handleSignIn = async () => {
    setLoading(true); // Set loading to true when sign-in starts
    console.log("Attempting to sign in...");
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false); // Set loading to false when validation fails
      return;
    }
    if (!password) {
      setPasswordError("Please enter your password.");
      setLoading(false); // Set loading to false when validation fails
      return;
    }
    console.log("Requesting authentication with email:", email, "and password:", password);
    try {
      const requestData = await signIn({ username: email, password: password });
      console.log("Request Data:", requestData); // Log requestData to inspect its structure
      console.log("Authentication successful!");
      setSuccessMessage("Sign-in successful!"); // Adding setSuccessMessage
       // Set loading to false when sign-in is successful

      if (!requestData) {
        console.error("Sign-in request data is empty.");
        setPasswordError("Authentication failed: Sign-in request data is empty.");
        return;
      }

      const getUserResponse = await fetch(`https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/users?email=${email}`);
      console.log("Get User Response:", getUserResponse); // Log getUserResponse to check if it's successful

      if (getUserResponse.ok) {
        const userDataResponse = await getUserResponse.json();
        console.log("User Data Response:", userDataResponse); // Log userDataResponse to inspect its structure
        const userData = userDataResponse.user;
        console.log("User Data:", userData); // Log userData to inspect its structure
        
        const userId = userData && userData.User_ID; // Ensure userData exists before accessing User_ID
        console.log("User ID:", userId); // Log userId to see if it's retrieved
        
        if (userId) {
          localStorage.setItem('userID', JSON.stringify(userData.User_ID))
          // Verify if the user is an admin
          const adminResponse = await fetch(`https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/admin/${userId}`);
          // console.log("Admin Response:", adminResponse); // Log adminResponse to check if it's successful

          if (adminResponse.ok) {
            console.log("User is an admin.");
            navigate("/adminhome", { state: { isAdmin: true } });
            setLoading(false); // Set loading to false when sign-in fails

            return;
          } else {
            console.log("User is not an admin.");
            navigate("/home", { state: { isAdmin: false } });
            setLoading(false); // Set loading to false when sign-in fails

            return;
          }
        } else {
          console.error("User ID not found in userData");
          setPasswordError("User ID not found in userData");
        }
      } else {
        console.error("Error fetching user data:", getUserResponse.status);
        setPasswordError("Error fetching user data");
        navigate("/home")
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setPasswordError("Authentication failed: " + error.message);
      setLoading(false); // Set loading to false when sign-in fails
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPasswordCode = async (email) => {
    if (validateEmail(email)) {
      try {
        const data = await resetPassword({ username: email });
        console.log('Forgot password code sent:', data);
        navigate('/resetpassword', { state: { email } });
      } catch (error) {
        console.error('Error sending forgot password code:', error);
        setEmailError('Error sending forgot password code: ' + error.message);
      }
    } else {
      setEmailError('Please enter a valid email address.');
    }
  };

  const verifyIfAdminOrInspector = async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log("THE ATTRIBUTES OF THIS SESSION ARE:", userAttributes);
      console.log("THIS USER IS AN:", userAttributes['custom:userType']);

      return userAttributes;

    } catch (error) {
      console.log(error);
    }
  }

  const verifyIfSignedIn = async () => {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);
  
      if (username && userId) {
        const userAttributes = await verifyIfAdminOrInspector();
  
        if (userAttributes['custom:userType'] === "Admin") {
          navigate('/adminhome', { state: { isAdmin: true, email } }); // Pass isAdmin as true
        } else {
          navigate('/home', { state: { isAdmin: false, email } }); // Pass isAdmin as false
        }
      } else {
        setSessionLoading(false);
      }
  
    } catch (err) {
      console.log(err);
      setSessionLoading(false);
    }
  }
  

  if (!sessionLoading) {return (
    <>
      <Helmet>
        <title>BitBusters</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex md:flex-col self-stretch justify-end  w-full pb-7 sm:pb-5 overflow-auto bg-white-A700">
        <div className="h-[950px] self-stretch w-full mt-[0px] mb-[90px] relative">
          <div className="justify-center self-stretch h-[1200px] w-full left-0 bottom-0 right-0 top-0 m-auto border-gray-200 border-r-[0.5px] border-solid bg-gray-800 absolute" />
          <div className="justify-center self-stretch h-[1200px] w-full left-0 bottom-0 right-0 top-0 m-auto absolute">
            <Img
              src="images/img_image_1.png"
              alt="imageone_one"
              className="justify-center self-stretch h-[1200px] w-full md:h-auto left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
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
          <div className="flex flex-col items-center justify-end px-14 py-[101px] md:p-5">
            <div className="flex flex-col items-center w-[50%] md:w-full mt-[160px] gap-[25px]">
              <div className="flex justify-center">
                <Heading size="lg" as="h2" className="!text-blue_gray-900">
                  Welcome back!
                </Heading>
              </div>
              <div className="flex flex-col w-[450px] pb-2 gap-[15px] px-2">
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
               
                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline">{successMessage}</span>
                  </div>
                )}
                
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
                onClick={() => handleForgotPasswordCode(email)}
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
      {loading && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-100"></div>
  </div>
)}

    </>
  );}

  else{
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
        }}
      >
        <div
          style={{
            border: '4px solid #ccc',
            borderTopColor: '#333',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ marginTop: '16px', fontSize: '16px', color: '#333' }}>
          Verifying existing session...
        </p>
      </div>
    );
  }

}
