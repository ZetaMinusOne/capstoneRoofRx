import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Heading, Text, } from "../components";
import Sidebar1 from "../components/SideBar";
import DropdownMenu from "../components/DropDown"
import Modal from "../components/Modals/AccountInformationErrorModal"
import SignatureCanvas from "react-signature-canvas";
import { updatePassword } from 'aws-amplify/auth';
import FadeLoader from "react-spinners/ClipLoader";
import { Amplify } from 'aws-amplify';
import config from '../aws-exports';
import { downloadData, } from 'aws-amplify/storage';
import {useLocation} from "react-router-dom";
import CustomInput from "../components/TextBoxInput";
import {PasswordInput} from "../components/EyeInput"

Amplify.configure(config);

export default function PersonalInformationPage() {
  let imageSignatureURL = "";
  const downloadImage = async (url) =>{
    
    console.log("URL", url.toString(url))
    const parts = url.split('/')
    
    const bucket_name = parts[2].split('.')[0]

    const objectKey = parts.slice(4).join('/');

    console.log("parsing url", parts, bucket_name, objectKey);
    
    try {
      console.log("Entering try");

      const downloadResult = await downloadData({ key:objectKey}).result;
      console.log("THIS IS THE OBJECT KEY", objectKey);
      const blobThing = await downloadResult.body.blob();
      const imgURL = URL.createObjectURL(blobThing);

      console.log("image URL",imgURL)
      setBlob(imgURL);

      console.log("BLOB:", blob)
      console.log('Succeed: ', blobThing);
    } catch (error) {
      console.log('Error : ', error);
    }
  } 

  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameErrorChar, setFirstNameErrorChar] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameErrorChar, setLastNameErrorChar] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;

  const [confirmPasswordError, setConfirmPasswordError] = useState(false);


  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordIsEmpty, setPasswordIsEmpty] = useState(false); //This verify if the password input is empty

  const [edit, setEdit] = useState(false)
  const [selectedInput, setSelectedInput] = useState(false);

  const [activeModal, setActiveModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [confirmChanges, setConfirmChanges] = useState(false);

  const signatureCanvasRef = useRef(null);
  const [Url, setUrl] = useState();
  const [editSignature, setEditSignature] = useState(false);
  
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
    userId: "",
    signature: "",
  })

  const [originalPersonalInfo, setOriginalPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
    userId: "",
    signature: "",
  })

  const [blob, setBlob] = useState("");

  const userID = localStorage.getItem('userID')
  useEffect(() => {
    
    fetchData(); // Call the async function
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    disableErrors();
    try {
      const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/users/${userID}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data); // Set fetched data into state
      
      const user = data.user;
      if (data.user) {

        setPersonalInfo({ ...personalInfo, firstName: user.FirstName, lastName: user.LastName, phoneNumber: user.PhoneNumber, email: user.Email, userId: user.User_ID, signature: user.Signature_URL });
        setOriginalPersonalInfo({ ...originalPersonalInfo, firstName: user.FirstName, lastName: user.LastName, phoneNumber: user.PhoneNumber, email: user.Email, userId: user.User_ID, signature: user.Signature_URL });
        if(user.Signature_URL !== null){
          console.log("Signature_URL from fecthdata", user.Signature_URL)
          await downloadImage(user.Signature_URL);
      }
    }
    setIsLoading(false); // Set loading to false once data is loaded

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setError(error.message);
      setIsLoading(false);
    }
  }

  const handleUpdate = async () => {
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/users/${userID}`; // Make sure URL is correct
    const dataToSend = {
      FirstName: personalInfo.firstName,
      LastName: personalInfo.lastName,
      PhoneNumber: personalInfo.phoneNumber,
      Signature_URL: imageSignatureURL,
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Update successful:', result);
      // alert('Profile updated successfully!');
    } catch (error) {
      console.error('There was an error updating the profile:', error);
      // alert('Failed to update profile.');
    }
  };

  const handleUploadSignature = async (signature) => {
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/s3bucket/signatures`
    const data = {
      signature_data_url: signature,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
      const result = await response.json();
      console.log('Signature uploaded successfully:', result);
      setPersonalInfo({...personalInfo, signature: result.uploaded_url})
      imageSignatureURL = result.uploaded_url;
      return result;
    } catch (error) {
      console.error('There was an error uploading the signature:', error);
    }    
  }

  const handleUpdateSignature = async (oldSignature, newSignature) => {
    
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/s3bucket/signatures`
    const data = {
      old_signature_key: oldSignature,
      new_signature_data_url: newSignature,
    }
    
    try{
      const response = await fetch(url, {
        method: "PUT",
        headers:{
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
      })

      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setPersonalInfo({...personalInfo, signature: result.updated_url})
      console.log('PERSONALINFO FROM UPDATESIGANTURE:', personalInfo);
      imageSignatureURL = result.updated_url;
      console.log('Signature updated successfully:', result.updated_url);
      console.log('Signature updated successfully:', imageSignatureURL);
    } catch{
      console.error('There was an error updating the signature:', error);
    }
  }

  const handleExtractURL = (url) =>{
    const imgURL = 'https://bitbusters-images-and-mlmodel-data.s3.amazonaws.com/';
    console.log("imgURL", imgURL);
    return imgURL.slice(imgURL.length)
  }

  const handleFirstNameChange = (e) => {
    const newValue = e.target.value.trimStart();

    if (newValue.length > 20) {
      setFirstNameError(true);

    } else {
      setFirstNameError(false);
    }

    if (/[~`1234567890\-=[\]\\;',./!@#$%^&*()_+{}|:"<>?]/.test(newValue) || newValue.trim().length === 0) {
      setFirstNameErrorChar(true)

    } else {
      setFirstNameErrorChar(false);
    }
    setPersonalInfo({ ...personalInfo, firstName: newValue }); //This update the context
    console.log("length", newValue)
    console.log("e.target.value.trim()", e.target.value.trim())
  };

  const handleLastNameChange = (e) => {
    const newValue = e.target.value.trimStart();

    if (newValue.length > 30) {
      setLastNameError(true);
    } else {
      setLastNameError(false);
    }

    if (/[~`1234567890\-=[\]\\;',./!@#$%^&*()_+{}|:"<>?]/.test(newValue) || newValue.trim().length === 0) {
      setLastNameErrorChar(true)
    } else {
      setLastNameErrorChar(false);
    }
    setPersonalInfo({ ...personalInfo, lastName: newValue }); //This update the context
  };

  const handlePhoneNumberChange = (e) => {
    const newValue = e.target.value.trim();

    if (/^\+?\d{0,3}?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(newValue) && /^[\d+\-]*$/.test(newValue) && newValue.length <= 13) {
      setPhoneNumberError(false);
    } else {
      setPhoneNumberError(true);
    }

    setPersonalInfo({ ...personalInfo, phoneNumber: newValue });
  };


  const handleEmailMessage = () => {
    setSelectedInput(!selectedInput);
  }

  const handlePassword = (e) => {
    const newValue = e.target.value;
    if (newValue.length === 0 && (personalInfo.newPassword.length !== 0 || personalInfo.confirmNewPassword !== 0)) {
      setPasswordIsEmpty(true);
    } else {
      setPasswordIsEmpty(false)
    }
    setPasswordError(false);
    setPersonalInfo({ ...personalInfo, password: newValue });
  }

  const handleNewPasswordChange = (e, maxLength) => {
    const newValue = e.target.value;
    setPassword(newValue);

    if (newValue.length <= maxLength) {
      setNewPasswordError(false);
    } else {
      setNewPasswordError(true);
    }

    setIsLengthValid(newValue.length >= 8);
    setHasUppercase(/[A-Z]/.test(newValue));
    setHasLowercase(/[a-z]/.test(newValue));
    setHasNumber(/[0-9]/.test(newValue));
    setHasSpecialChar(/[~`\-=[\]\\;',./!@#$%^&*()_+{}|:"<>?]/.test(newValue));

    if (personalInfo.password.trim().length === 0 && (personalInfo.newPassword.length !== 0 || personalInfo.confirmNewPassword !== 0)) {
      setPasswordIsEmpty(true);
    }

    if (e.target.value !== personalInfo.confirmNewPassword) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }

    setPersonalInfo({ ...personalInfo, newPassword: newValue });
  };

  const handleReEnterPassword = (e) => {
    const newValue = e.target.value;
    if (newValue !== personalInfo.newPassword) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
    setPersonalInfo({ ...personalInfo, confirmNewPassword: newValue });
  };

  const handleClear = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear(); // Access the clear method through the ref
    }
    console.log(signatureCanvasRef)
  };

  const handleGenerate = async () => {
    // setUrl(signatureCanvasRef.current.getTrimmedCanvas().toDataURL(`${personalInfo.userId}/${personalInfo.firstName}/${personalInfo.lastName}/signature/png`));
    let response = "";
    if(personalInfo.signature === null){
      response = await handleUploadSignature(signatureCanvasRef.current.getTrimmedCanvas().toDataURL(`${personalInfo.userId}/${personalInfo.firstName}/${personalInfo.lastName}/signature/png`));
      // setUrl(response.uploaded_url)
      console.log("response",response)
      // const key = handleExtractURL(response.uploaded_url)
      // setPersonalInfo(...personalInfo, {signature: url});
      // console.log("Key image",key)
      // If response is valid and contains 'uploaded_url', update state
      // console.log("PersonalInfo Signature inserted", personalInfo);
      if (response && response.uploaded_url) {
        console.log("Uploaded URL:", response.uploaded_url);
        setUrl(response.uploaded_url)
        console.log("UPDATING URL WITH SETURL", URL)
        // setPersonalInfo(prevState => ({
        //   ...prevState,
        //   signature: response.uploaded_url
        // }));

        // const result = await getUrl({key:key, options: {level: `guest`}});
        //setUrl(response.uploaded_url);  // Update the URL with the uploaded one from server
        // console.log("image:",result)
      //   setPersonalInfo(prevState => ({
      //     ...prevState,
      //     signature: response.uploaded_url
      // }));
    } else {
        console.error("Failed to get uploaded URL from response.");
    }
    } else {
    console.log("URL", personalInfo.toString(personalInfo.signature))
    const parts = personalInfo.signature.split('/')
    
    const bucket_name = parts[2].split('.')[0]

    const objectKey = parts.slice(3).join('/');

    console.log("parsing url", parts, bucket_name, objectKey);
    console.log("signature from handle generated", signatureCanvasRef.current.getTrimmedCanvas().toDataURL(`${personalInfo.userId}/${personalInfo.firstName}/${personalInfo.lastName}/signature/png`))
    await handleUpdateSignature(objectKey, signatureCanvasRef.current.getTrimmedCanvas().toDataURL(`${personalInfo.userId}/${personalInfo.firstName}/${personalInfo.lastName}/signature/png`));
    }
  }

  useEffect(()   => {
    // React to changes in signature specifically
    if (personalInfo.signature) {
        console.log('Signature has been updated:', personalInfo.signature);
        handleUpdate();
        // downloadImage(personalInfo.signature);
    }
}, []); 

  const handleUrl = () => {
    setUrl(undefined);
    console.log("handleUrl", URL);
  }

  const handleUpdateProfile = () => {
    setEdit(!edit);
  };

  const handleConfirmChanges = async () => {
    let hasError = false;
    if (editSignature) {
      await handleGenerate();
      setEditSignature(false);
    }

    // if (personalInfo.password.length !== 0 && personalInfo.newPassword.length !== 0 && personalInfo.confirmNewPassword.length !== 0 && isLengthValid && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
    //   setPersonalInfo({ ...personalInfo, password: personalInfo.newPassword, newPassword: "", confirmNewPassword: "" });
    // }

    try {
      if (personalInfo.password.length !== 0 && personalInfo.newPassword.length !== 0 && personalInfo.confirmNewPassword.length !== 0 && personalInfo.newPassword === personalInfo.confirmNewPassword) {
        setIsLoading(true)
        await updatePassword({ oldPassword: personalInfo.password, newPassword: personalInfo.newPassword })
        setIsLoading(false)
      }
    } catch (error) {
      // setErrorModal(true);
      hasError = true;
      console.log("Entering in catch")
      setPasswordError(true);
      console.log("Exiting catch")
      setIsLoading(false)
    }
    console.log("passwordError", passwordError)

      
      if (!isLoading) {
        
        if (hasError || personalInfo.firstName.length === 0
          || personalInfo.lastName.length === 0
          || personalInfo.phoneNumber.length === 0
          || (personalInfo.password.length !== 0 && personalInfo.newPassword.length === 0 && personalInfo.confirmNewPassword.length === 0)
          || (personalInfo.password.length === 0 && personalInfo.newPassword.length !== 0 && personalInfo.confirmNewPassword.length === 0)
          || (personalInfo.password.length === 0 && personalInfo.newPassword.length === 0 && personalInfo.confirmNewPassword.length !== 0)
          || (personalInfo.password.length !== 0 && personalInfo.newPassword.length !== 0 && personalInfo.confirmNewPassword.length === 0)
          || (personalInfo.password.length === 0 && personalInfo.newPassword.length !== 0 && personalInfo.confirmNewPassword.length !== 0)
          || (personalInfo.password.length !== 0 && personalInfo.newPassword.length === 0 && personalInfo.confirmNewPassword.length !== 0)
          || firstNameError
          || firstNameErrorChar
          || lastNameError
          || lastNameErrorChar
          || phoneNumberError
          || passwordError
          || newPasswordError
          || (!isLengthValid && personalInfo.newPassword.length !== 0)
          || (!hasUppercase && personalInfo.newPassword.length !== 0)
          || (!hasLowercase && personalInfo.newPassword.length !== 0)
          || (!hasNumber && personalInfo.newPassword.length !== 0)
          || (!hasSpecialChar && personalInfo.newPassword.length !== 0)
          || confirmPasswordError
          || ((personalInfo.newPassword.length !== 0 || originalPersonalInfo.newPassword.length !== 0) &&
          (!isLengthValid && !hasUppercase && !hasLowercase && !hasNumber && !hasSpecialChar)) || confirmPasswordError) 
          {
            console.log("Entering in if with Password Errr Value of: ", passwordError)
            setErrorModal(true);
          } else {
            console.log("Entering in else with Password Errr Value of: ", passwordError)
            disableErrors();
            try {
              
              setIsLoading(true);
              await handleUpdate(); // Calls the PUT request function
              setTimeout(() => {
                fetchData();
              }, 2000)
              //setActiveModal(false); // Close modal upon success
              //setEdit(false); // Exit edit mode
            } catch (error) {
              console.error('Failed to update:', error);
              // Optionally, handle the error in UI, e.g., show an error message
            }
          }
        }
  }

  const disableErrors = () => {
    setErrorModal(false);
    setOriginalPersonalInfo(personalInfo);
    // updateUserInformation();
    setFirstNameError(false);
    setFirstNameErrorChar(false);
    setLastNameError(false);
    setLastNameErrorChar(false);
    setPhoneNumberError(false);
    setPasswordError(false);
    setPasswordIsEmpty(false);
    setNewPasswordError(false);
    setIsLengthValid(false);
    setHasUppercase(false);
    setHasLowercase(false);
    setHasNumber(false);
    setHasSpecialChar(false);
    setConfirmPasswordError(false);
  }

  const handleCancel = () => {
    setPersonalInfo(originalPersonalInfo)
  }

  // console.log("personalInfo and", personalInfo, "Password", password);
  // console.log("confirm changes", personalInfo.firstName.length === 0
  //   || personalInfo.lastName.length === 0
  //   || personalInfo.phoneNumber.length === 0
  //   || (personalInfo.password.length !== 0 && personalInfo.newPassword.length === 0 && personalInfo.confirmNewPassword.length === 0)
  //   || (personalInfo.password.length === 0 && personalInfo.newPassword.length !== 0 && personalInfo.confirmNewPassword.length === 0)
  //   || (personalInfo.password.length === 0 && personalInfo.newPassword.length === 0 && personalInfo.confirmNewPassword.length !== 0)
  //   || (personalInfo.password.length !== 0 && personalInfo.newPassword.length !== 0 && personalInfo.confirmNewPassword.length === 0)
  //   || (personalInfo.password.length === 0 && personalInfo.newPassword.length !== 0 && personalInfo.confirmNewPassword.length !== 0)
  //   || (personalInfo.password.length !== 0 && personalInfo.newPassword.length === 0 && personalInfo.confirmNewPassword.length !== 0)
  //   || firstNameError
  //   || firstNameErrorChar
  //   || lastNameError
  //   || lastNameErrorChar
  //   || phoneNumberError
  //   || passwordError
  //   || newPasswordError
  //   || (!isLengthValid && personalInfo.newPassword.length !== 0)
  //   || (!hasUppercase && personalInfo.newPassword.length !== 0)
  //   || (!hasLowercase && personalInfo.newPassword.length !== 0)
  //   || (!hasNumber && personalInfo.newPassword.length !== 0)
  //   || (!hasSpecialChar && personalInfo.newPassword.length !== 0)
  //   || confirmPasswordError
  //   || ((personalInfo.newPassword.length !== 0 || originalPersonalInfo.newPassword.length !== 0) &&
  //     (!isLengthValid && !hasUppercase && !hasLowercase && !hasNumber && !hasSpecialChar)) || confirmPasswordError
  // )
  // console.log("password condition", personalInfo.password.length !== 0 && personalInfo.newPassword.length !== 0 && personalInfo.confirmNewPassword.length !== 0 && isLengthValid && hasUppercase && hasLowercase && hasNumber && hasSpecialChar)
  console.log("Data from Db", items);
  console.log("Personal Information from outside", personalInfo);
  console.log("Rendering signature with URL:", personalInfo.signature);
  return (
    <>
      <Helmet>
        <title>Account Information</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>


      <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">
        <div className="flex justify-end w-[100%] md:w-full items-start gap-[2px] absolute top-0 rigth-0">
          <DropdownMenu />
        </div>
        <Sidebar1 isAdmin={isAdmin}  className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />

        {isLoading ?
          <div className="flex justify-center m-auto">
            <FadeLoader
              color={"303F9F"}
              loading={isLoading}
              size={75}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
          :
          <div className="flex flex-col w-full gap-7 justify-center md:w-full m-[180px]">
            {!edit ? (
              <div className="flex flex-col items-center w-full gap-7">

                <div className="flex flex-col items-center w-full gap-7 ">
                  <div className="flex flex-col items-start w-full gap-7 max-w-[500px]">
                    <Text size="md" as="p" className="!text-gray-900_01 !font-poppins border-b-2 text-lg">
                      Personal Information
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
                      Last Names{" "}
                    </Heading>
                    {personalInfo.lastName}
                  </div>
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
                  <div className="flex flex-col items-start gap-[9px] w-full max-w-[500px]">
                    <Heading as="h6" className="uppercase">
                      Signature
                    </Heading>
                  </div>
                  <div className="flex flex-col items-start gap-[9px] w-full max-w-[500px] border h-[250px]">
                    {(personalInfo.signature !== null) && <img src={blob} alt="signature" style={{ width: "500px", height: "250px" }} />}
                  </div>
                  <button
                    onClick={handleUpdateProfile}
                    className="p-2 font-dmsans font-bold min-w-[159px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700">
                    Edit
                  </button>
                </div>

              </div>
            )
              :
              (
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
                      value={personalInfo.firstName}
                      onChange={(e) => {
                        handleFirstNameChange(e);
                      }}
                      placeholder={`Enter First Name `}
                      className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal"
                    />
                    {firstNameError && <Text size="xs" className="text-red-500">First name should not exceed 20 characters.</Text>}
                    {firstNameErrorChar && <Text size="xs" className="text-red-500">You can use only alphabetic characters</Text>}

                  </div>
                  <div className="flex flex-col items-start w-full gap-[9px] max-w-[500px]">
                    <Heading as="h2" className="uppercase">
                      Last Names{" "}
                    </Heading>
                    <input
                      value={personalInfo.lastName}
                      onChange={(e) => {
                        handleLastNameChange(e);
                      }}
                      placeholder={`Enter your Last Name `}
                      className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal"
                    />
                    {lastNameError && <Text size="xs" className="text-red-500">Last name should not exceed 30 characters.</Text>}
                    {lastNameErrorChar && <Text size="xs" className="text-red-500">You can use only alphabetic characters</Text>}
                  </div>
                  <div className="flex flex-col items-start w-full gap-[9px] max-w-[500px]">
                    <Heading as="h3" className="!text-gray-700 uppercase">
                      Phone
                    </Heading>
                    <input
                      value={personalInfo.phoneNumber}
                      onChange={(e) => {
                        handlePhoneNumberChange(e);
                      }}
                      placeholder={`Enter Client Last Name `}
                      className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal"
                    />
                    {phoneNumberError && <Text size="xs" className="text-red-500">Please enter a valid phone number.</Text>}
                  </div>
                  <div className="flex flex-col items-start w-full gap-[9px] max-w-[500px]">
                    <Heading as="h4" className="!text-gray-700 uppercase">
                      Email
                    </Heading>
                    <input
                      value={personalInfo.email}
                      onClick={handleEmailMessage}
                      onBlur={handleEmailMessage}
                      className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal " />
                    <div className="flex flex-col items-start w-full gap-[9px] text-center">

                      {selectedInput && <div className="text-red-500"> You cannot modify the email</div>}

                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-[9px] w-full max-w-[500px]">
                    <Heading as="h5" className="uppercase">
                    Current Password
                    </Heading>
                    <PasswordInput
                      handlePasswordChange={(e) => {
                        handlePassword(e);
                      }}    //This is to send this password to the database
                      placeholder={`Enter your current password `}
                      className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal" />
                    { passwordError && <Text size="xs" className="text-red-500">Incorrect Password</Text>}
                    {(passwordIsEmpty && personalInfo.newPassword.length !== 0) && <Text size="xs" className="text-red-500">To update your password you must write your current password.</Text>}
                  </div>
                  <div className="flex flex-col items-start gap-[9px] w-full max-w-[500px]">
                    <Heading as="h5" className="uppercase">
                      New Password
                    </Heading>
                    <PasswordInput
                      handlePasswordChange={(e) => {
                        handleNewPasswordChange(e, 20)
                      }}

                      placeholder={`Enter your new password `}
                      className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal"
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
                      <Text size="xs" className="text-xs">Special characters: !@#$%^&*(),.?":{ }|&lt;&gt;</Text>
                    </div>

                    {newPasswordError && <Text size="xs" className="text-red-500">Password must have a length of 20 charcaters</Text>}
                    {((!isLengthValid || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) && personalInfo.newPassword.length !== 0) && <Text size="xs" className="text-red-500">New Password must meet the above criterias</Text>}

                  </div>
                  <div className="flex flex-col items-start gap-[9px] w-full max-w-[500px]">
                    <Heading as="h6" className="uppercase">
                      Confirm New Password
                    </Heading>
                    <PasswordInput
                      handlePasswordChange={(e) => {
                        handleReEnterPassword(e)
                      }}
                      placeholder={`Re-enter your new password`}
                      className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal"
                    />
                    {confirmPasswordError && <Text size="xs" className="text-red-500">Password does not match.</Text>}
                  </div>
                  <div className="flex flex-col items- gap-[9px] w-full max-w-[500px]">
                    <Heading as="h6" className="uppercase">
                      Signature
                    </Heading>
                    {
                      editSignature ?
                        (
                          <SignatureCanvas
                            penColor="black"
                            canvasProps={{ width: 500, height: 250, className: 'sigCanvas border-4' }}
                            ref={signatureCanvasRef}
                          />
                        ) : (
                          <div className="flex flex-col items-start gap-[9px] w-full max-w-[500px] border h-[250px]">
                            {(personalInfo.signature !== null) && <img src={blob} alt="signature" style={{ width: "500px", height: "250px" }} />}
                          </div>
                        )
                    }
                    <div className="flex ">
                      {!editSignature ? (
                        <button className="border border-gray-500 bg-zinc-300 m-auto w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={() => { setEditSignature(true); }} >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button className="border border-gray-500 bg-zinc-300 m-auto w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={handleClear} >
                            Clear
                          </button>
                          <button className="border border-gray-500 bg-zinc-300 m-auto w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right"  onClick={() => { setUrl(Url); setEditSignature(false); }}>
                            Cancel
                          </button>
                        </>
                      )}

                    </div>
                  </div>

                  <div className="flex justify-between w-full max-w-[500px] m-auto">
                    <button
                      onClick={() => {
                        if (personalInfo.password.length === 0 && personalInfo.newPassword.length === 0 && personalInfo.confirmNewPassword.length === 0) {
                          setPasswordIsEmpty(false);
                        }
                        setActiveModal(true)
                      }}
                      className="p-2 font-dmsans font-bold min-w-[159px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700">
                      Confirm Changes
                    </button>

                    <button
                      onClick={() => {
                        handleCancel();
                        setEdit(false);
                      }}
                      className="p-2 font-dmsans font-bold min-w-[159px] rounded-[24px] bg-zinc-300 hover:bg-zinc-400">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
          </div>
        }
      </div>

      {activeModal && <Modal toggleModal={() => setActiveModal(!activeModal)} errorModal={errorModal} toggleConfirmChanges={() => setConfirmChanges(!confirmChanges)} confirmChanges={confirmChanges} handleUpdateProfile={() => handleUpdateProfile()} handleConfirmChanges={async  () => {await handleConfirmChanges();}} isLoading={isLoading}/>}



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