// PersonalInformationPage.js
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Heading, Text, Img, SelectBox } from "../components";
import Sidebar1 from "../components/SideBar";
import CustomInput from "../components/TextBoxInput";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../components/DropDown"
import ErrorModal from "../components/Modals/EditInformationErrorModal"
import SuccessModal from "../components/Modals/InformationUpdatedModal"

const dropDownOptions = [
  { label: "Personal Info", value: "option1" },
  { label: "Log Out", value: "option2" },
];

const isValidPassword = (password) => {
  return password.length >= 8;
};

const isValidPhoneNumber = (phoneNumber) => {
  // Adjusted pattern to allow for optional country code and spaces
  const phoneNumberPattern = /^\+?\d{0,3}?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneNumberPattern.test(phoneNumber);
};



export default function PersonalInformationPage() {

  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameErrorChar, setFirstNameErrorChar] = useState(false);

  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameErrorChar, setLastNameErrorChar] = useState(false);

  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [emailError, setEmailError] = useState(false);


  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [confirmChangesError,setConfirmChangesError] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [edit,setEdit] = useState(false)
  const [valid, setValid] = useState(true)
  const [selectedInput,setSelectedInput] = useState(false);


  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Juan",
    lastName: "Perez",
    phoneNumber: "7879088824",
    email: "juan34daniel@gmail.com",
    password: "********",
    newPassword:"",
    confirmNewPassword:"",
  })

  const handleEmailMessage= () =>{
    setSelectedInput(!selectedInput);
  }

  // const handleConfirmPasswordChange = (e) => {
  //   const newValue = e.target.value;
  //   setConfirmPassword(newValue);
  //   setConfirmPasswordError("");
  // };

  // const handlePhoneNumberChange = (e) => {
  //   const newValue = e.target.value;
  //   setPhoneNumber(newValue);
  //   setPhoneNumberError("");
  // };

  const handleUpdateProfile = () => {
    setEdit(!edit);
  };

  const handleConfirmChanges = () =>{
    // if (!isValidPassword(password)) {
    //   setPasswordError("Password must be at least 8 characters long.");
    //   setValid(false);
    // }

    // if (password !== confirmPassword) {
    //   setConfirmPasswordError("Passwords do not match.");
    //   setValid(false);
    // }

    // if (!isValidPhoneNumber(phoneNumber)) {
    //   setPhoneNumberError("Please enter a valid phone number.");
    //   setValid(false);
    // }

    if(firstNameError || firstNameErrorChar 
      || lastNameError 
      || lastNameErrorChar 
      || phoneNumberError 
      || passwordError 
      || newPasswordError 
      // || !isLengthValid 
      // || !hasUppercase 
      // || !hasLowercase 
      // || !hasNumber 
      // || !hasSpecialChar 
      || confirmPasswordError)
      {
      setConfirmChangesError(true);
      setErrorModal(true);
    } else{
      setConfirmChangesError(false);
      setSuccessModal(true);
    }

    // If all validations pass, proceed with updating the profile
    //if (valid) {
      // Place your logic for updating the profile here
      // For example, navigate to another page
      //navigate("/home"); // Navigate to the profile page
    //}
  }

  const handleOptionChange = (selectedOption) => {
    if (selectedOption.value === "option1") {
      navigate("/accountinformation"); // Navigate to the account info page
    } else if (selectedOption.value === "option2") {
      // Perform logout action
      navigate("/signin");
    }
  };

  const handleInputChange = (key, value)=>{
    setPersonalInfo(prevState => ({
      ...prevState,
      [key]: value
    }));
  }

  console.log("personalInfo and",personalInfo, "Password", password);

  //HANDLE ERRORS

  const handleFirstNameChange = (e) => {
    const newValue = e.target.value;
    
    if (newValue.length > 20) {
      setFirstNameError(true);
      
    } else{
      setFirstNameError(false);
    }

    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(newValue)){
      setFirstNameErrorChar(true)
      
    } else{
      setFirstNameErrorChar(false);
    }
    setPersonalInfo({...personalInfo, firstName: newValue}); //This update the context
  };



  const handleLastNameChange = (e) => {
    const newValue = e.target.value;
    
    if (newValue.length > 30) {
      setLastNameError(true);
      return
    } else{
      setLastNameError(false);
    }
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(newValue)){
      setLastNameErrorChar(true)
      return
    }else{
      setLastNameErrorChar(false);
    }
    setPersonalInfo({...personalInfo, lastName: newValue}); //This update the context
  };

  const handlePhoneNumberChange = (e) => {
    const newValue = e.target.value;
    
    if (/^[\d+\-]*$/.test(newValue) && newValue.length <= 13) {
      setPhoneNumberError(false);
      setPersonalInfo({...personalInfo, phoneNumber: newValue}); //This update the context
    } else{
      setPhoneNumberError(true);
    }
    };
  

    const handleNewPasswordChange = (e, maxLength) => {
      const newValue = e.target.value;
      const truncatedValue = newValue.slice(0, maxLength);
      setPassword(truncatedValue);
      // setNewPasswordError("");
  
      setIsLengthValid(truncatedValue.length >= 8);
      setHasUppercase(/[A-Z]/.test(truncatedValue));
      setHasLowercase(/[a-z]/.test(truncatedValue));
      setHasNumber(/[0-9]/.test(truncatedValue));
      setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(truncatedValue));
  
      if (newValue.length > maxLength) {
        setNewPasswordError(true);
      } else{
        setNewPasswordError(false);
      }
    };

    const handleReEnterPassword = (value) => {
      if (value !== personalInfo.newPassword) {
        setConfirmPasswordError(true);
      } else {
        setConfirmPasswordError(false);
      }
    };
    
    


  return (
    <>
      <Helmet>
        <title>AccountInformation</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>


      <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">
      <div className="flex justify-end w-[100%] md:w-full items-start gap-[2px] absolute top-0 rigth-0">
          <DropdownMenu />
        </div>
        <Sidebar1 className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
        
        <div className="flex flex-col w-full gap-7 justify-center md:w-full m-[180px]">
        {!edit ? (
          <div className="flex flex-col items-center w-full gap-7">

          <div className="flex flex-col items-center w-full gap-7 ">
            <div className="flex flex-col items-start w-full gap-7 max-w-[500px]">
              <Text size="md" as="p" className="!text-gray-900_01 !font-poppins border-b-2 text-lg">
                Edit Personal Information
              </Text>
            </div>
            <div className="flex flex-col items-start w-full gap-[9px] max-w-[500px]">
              <Heading as="h1" className="uppercase">
              First Name
              </Heading>
              {personalInfo.firstName}
            </div>
            <div className="flex flex-col items-start w-full gap-[9px] max-w-[500px]">
              <Heading as="h2" className="uppercase">
                Last Name{" "}
              </Heading>
              {personalInfo.lastName}
            </div>
            {/* </div> */}
            {/* <div className="flex md:flex-col self-stretch gap-5 w-[1000px]"> */}
            <div className="flex flex-col items-start w-full gap-[9px] max-w-[500px]">
              <Heading as="h3" className="!text-gray-700 uppercase">
                Phone
              </Heading>
              {personalInfo.phoneNumber}
            </div>
            <div className="flex flex-col items-start w-full gap-[9px] max-w-[500px]">
                  <Heading as="h4" className="!text-gray-700 uppercase">
                    Email
                  </Heading>
                  {personalInfo.email}
                </div>
            <div className="flex flex-col items-start gap-[9px] w-full max-w-[500px]">
              <Heading as="h5" className="uppercase">
               Password
              </Heading>
              ********
            </div>
            <Button
              color="indigo_700"
              size="xlg"
              onClick={handleUpdateProfile}
              className="lg:px-10 py-3 font-dmsans font-bold rounded-full w-[200px] mb-5" // Adjusted padding for width, keeping it rounded
            >
              Edit
            </Button>
          </div>

          </div>
          )
          : (
          <div className="flex flex-col items-center w-full gap-7 ">
            <div className="flex flex-col items-start w-full gap-7 max-w-[500px]">
              <Text size="md" as="p" className="!text-gray-900_01 !font-poppins border-b-2 text-lg">
                Edit Personal Information
              </Text>
            </div>
            <div className="flex flex-col items-start w-full gap-[9px] max-w-[500px]">
              <Heading as="h1" className="uppercase">
                First Name
              </Heading>
              <input
                  // shape="round"
                  // type="text"
                  // name="lastName"
                  // onChange={ (e) => handleLastNameChange(e)}
                  value = {personalInfo.firstName}
                  onChange={(e) => {
                    handleFirstNameChange(e); 
                    handleInputChange('firstName', e.target.value);}}
                  placeholder={`Enter First Name `}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
                {firstNameError && <Text size="xs" className="text-red-500">First name should not exceed 20 characters.</Text>}
                {firstNameErrorChar && <Text size="xs" className="text-red-500">You can use only alphabetic characters</Text>}

            </div>
            <div className="flex flex-col items-start w-full gap-[9px] max-w-[500px]">
              <Heading as="h2" className="uppercase">
                Last Name{" "}
              </Heading>
              <input
                  // shape="round"
                  // type="text"
                  // name="lastName"
                  // onChange={ (e) => handleLastNameChange(e)}
                  value = {personalInfo.lastName}
                  onChange={(e) => {
                    handleLastNameChange(e);
                    handleInputChange('lastName', e.target.value);}}
                  placeholder={`Enter your Last Name `}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
                {lastNameError && <Text size="xs" className="text-red-500">Last name should not exceed 30 characters.</Text>}
                {lastNameErrorChar && <Text size="xs" className="text-red-500">You can use only alphabetic characters</Text>}
            </div>
            {/* </div> */}
            {/* <div className="flex md:flex-col self-stretch gap-5 w-[1000px]"> */}
            <div className="flex flex-col items-start w-full gap-[9px] max-w-[500px]">
              <Heading as="h3" className="!text-gray-700 uppercase">
                Phone
              </Heading>
              <input
                  // shape="round"
                  // type="text"
                  // name="lastName"
                  // onChange={ (e) => handleLastNameChange(e)}
                  value = {personalInfo.phoneNumber}
                  onChange={(e) =>{
                    handlePhoneNumberChange(e);
                    handleInputChange('phoneNumber', e.target.value);}}
                  placeholder={`Enter Client Last Name `}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
              {phoneNumberError && <Text size="xs" className="text-red-500">Please enter a valid phone number.</Text>}
            </div>
            <div className="flex flex-col items-start w-full gap-[9px] max-w-[500px]">
                  <Heading as="h4" className="!text-gray-700 uppercase">
                    Email
                  </Heading>
                  <input
                    // shape="round"
                    // type="email"
                    // name="email"
                    value ={personalInfo.email}
                    onClick={handleEmailMessage}
                    onBlur={handleEmailMessage}
                    className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "                />
                   <div className="flex flex-col items-start w-full gap-[9px] text-center">
                  
                  {selectedInput && <div className="text-red-500"> You cannot modify the email</div> }
                  
                </div> 
                </div>
            <div className="flex flex-col items-start gap-[9px] w-full max-w-[500px]">
              <Heading as="h5" className="uppercase">
                Password
              </Heading>
              <input
                  // shape="round"
                  // type="password"
                  // name="lastName"
                  // onChange={ (e) => handleLastNameChange(e)}
                  value = {personalInfo.password}
                  onChange={(e) => {
                    // handleNewPasswordChange(e);
                    handleInputChange('password', e.target.value); //here is storing th password in the dictionary but is no adecuate
                    setPassword(e.target.value);}}    //This is to send this password to the database
                  placeholder={`Enter current password `}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "                />
                  {/* { passwordError && <Text size="xs" className="text-red-500">Password Error</Text>} */}
           </div>
            <div className="flex flex-col items-start gap-[9px] w-full max-w-[500px]">
              <Heading as="h5" className="uppercase">
                New Password
              </Heading>
              <input
                  // shape="round"
                  // type="text"
                  // name="lastName"
                  // onChange={ (e) => handleLastNameChange(e)}
                  onChange={(e) => {
                  handleInputChange('newPassword', e.target.value)
                  handleNewPasswordChange(e, 20)}}

                  placeholder={`Enter your new password `}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
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
                {newPasswordError && <Text size="xs" className="text-red-500">`Password must be between 8-20 characters</Text>}
            </div>
            <div className="flex flex-col items-start gap-[9px] w-full max-w-[500px]">
              <Heading as="h6" className="uppercase">
                Confirm New Password
              </Heading>
              <input
                  // shape="round"
                  // type="text"
                  // name="lastName"
                  // onChange={ (e) => handleLastNameChange(e)}
                  onChange={(e) => {
                    handleInputChange('confirmNewPassword', e.target.value);
                    handleReEnterPassword(e.target.value);
                  }}
                  placeholder={`Re-enter your new password`}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
              {confirmPasswordError && <Text size="xs" className="text-red-500">Password does not matched.</Text>}
            </div>
            <Button
              color="indigo_700"
              size="xlg"
              onClick={ () =>{
                handleInputChange('password', "********");
                handleConfirmChanges();
                if(!confirmChangesError){ handleUpdateProfile(); }
                }}
              className="lg:px-10 py-3 font-dmsans font-bold rounded-full w-[200px] mb-5" // Adjusted padding for width, keeping it rounded
            >
              Confirm Changes
            </Button>
          </div>
          )}
        </div>
      </div>

      {errorModal && <ErrorModal toggleModal = {() => setErrorModal(!errorModal)}/>}
      {successModal && <SuccessModal toggleModal = {() => setSuccessModal(!successModal)}/>}
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