import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button, Input, Heading, Text, Img, SelectBox } from "../components";
// import ReportGenerationOneColumnOne from "../components/ReportGenerationOneColumnOne";
import Sidebar1 from "../components/SideBar";
import { DragAndDrop } from "../components/DragAndDrop";
import DynamicInput from "../components/DynamicInput"
import SearchableDropdown from "../components/inputWithSearch"
import DropdownMenu from "../components/DropDown";
import Select from 'react-select';
import { useNavigate,useLocation } from "react-router-dom";
import { useContext } from "react";
import { reportGenerationContext } from "../components/Context";
import Modal from "../components/Modals/ReportGenerationModal"

export default function EditReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;

  const { data, setValues } = useContext(reportGenerationContext);

  const [originalData, setOriginalData] = useState(data); 

  const [formData, setFormData] = useState(data)
    // {
    //   firstName: "",
    //   lastName: "",
    //   address1: "",
    //   address2: "",
    //   country: "",
    //   state: "",
    //   city: "",
    //   zipcode: "",
    //   phoneNumber: "",
    //   email: "",
    //   date: "",
    // })

  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameErrorChar, setFirstNameErrorChar] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameErrorChar, setLastNameErrorChar] = useState(false);

  const [address1Error, setAddress1Error] = useState(false);
  const [address1Error2, setAddress1Error2] = useState(false);

  const [address2Error, setAddress2Error] = useState(false);
  const [address2Error2, setAddress2Error2] = useState(false);

  const [countryError, setCountryError] = useState(false);
  const [countryErrorChar, setCountryErrorChar] = useState(false);

  const [stateError, setStateError] = useState(false);

  const [cityError, setCityError] = useState(false);
  const [cityErrorChar, setCityErrorChar] = useState(false);

  const [zipcodeError, setZipcodeError] = useState(false);
  const [zipcodeErrorChar, setZipcodeErrorChar] = useState(false);


  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [phoneNumberError2, setPhoneNumberError2] = useState(false);
  
  const [emailError, setEmailError] = useState(false);
  const [emailError2, setEmailError2] = useState(false);

  const [dateError, setDateError] = useState();

  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    const savedData =  window.localStorage.getItem("data")
    const savedDataParse = savedData ? JSON.parse(savedData) : null;
    console.log("JSON.parse(savedData)",JSON.parse(savedData))
    console.log("savedDataParse",savedDataParse)
    if (data) setValues({...data, ...savedDataParse})
   //  console.log("data",data)
   }, [])
   
   useEffect(() => {
     window.localStorage.setItem("data", JSON.stringify(data))
     console.log(JSON.stringify(data))
   }, [data])

  const handleFirstNameChange = (e) => {
    const newValue = e.target.value;

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
    setFormData({ ...formData, firstName: newValue });
    setValues({ ...data, firstName: newValue }); //This update the context
  };

  const handleLastNameChange = (e) => {
    const newValue = e.target.value;

    if (newValue.length > 30) {
      setLastNameError(true);
      return
    } else {
      setLastNameError(false);
    }
    if (/[~`1234567890\-=[\]\\;',./!@#$%^&*()_+{}|:"<>?]/.test(newValue) || newValue.trim().length === 0) {
      setLastNameErrorChar(true)
      return
    } else {
      setLastNameErrorChar(false);
    }
    setFormData({ ...formData, lastName: newValue });
    setValues({ ...data, lastName: newValue }); //This update the context

  };


  const handleAddress1Change = (e) => {
    const newValue = e.target.value;

    if (newValue.length > 40) {
      setAddress1Error(true);
      return
    }
    if(newValue.trim().length === 0){
      setAddress1Error2(true);
    } else{
      setAddress1Error2(false);
    }
    setAddress1Error(false);
    setFormData({ ...formData, address1: newValue });
    setValues({ ...data, address1: newValue }); //This update the context
  };

  const handleAddress2Change = (e) => {
    const newValue = e.target.value;

    if (newValue.length > 40) {
      setAddress2Error(true);
      return
    }

    if(newValue.trim().length === 0){
      setAddress2Error2(true);
    } else{
      setAddress2Error2(false);
    }

    setAddress2Error(false);
    setFormData({ ...formData, address2: newValue });
    setValues({ ...data, address2: newValue }); //This update the context
  };

  const handleCityChange = (e) => {
    const newValue = e.target.value;

    if (newValue.length > 46) {
      setCityError(true);
    } else {
      setCityError(false)
    }

    if (/[~`1234567890\-=[\]\\;',./!@#$%^&*()_+{}|:"<>?]/.test(newValue) || newValue.trim().length === 0) {
      setCityErrorChar(true)
    } else {
      setCityErrorChar(false)
    }
    setFormData({ ...formData, city: newValue });
    setValues({ ...data, city: newValue }); //This update the context
  }

  const handleStateChange = (selectedOption) => {
    setFormData({ ...formData, state: selectedOption });
    setValues({ ...data, state: selectedOption }); //This update the context
  }

  const handleZipcodeChange = (e) => {
    const newValue = e.target.value;
    const numericRegex = /^[0-9]*$/;

    if (newValue.length > 9) {
      setZipcodeError(true);

    } else {
      setZipcodeError(false);
    }

    if (!numericRegex.test(newValue) || newValue.trim().length === 0) {
      setZipcodeErrorChar(true);
    } else {
      setZipcodeErrorChar(false);
    }
    setFormData({ ...formData, zipcode: newValue });
    setValues({ ...data, zipcode: newValue }); //This update the context
  }

  const handleCountryChange = (e) => {
    const newValue = e.target.value;

    if (newValue.length > 56) {
      setCountryError(true);

    } else {
      setCountryError(false)
    }

    if (/[~`1234567890\-=[\]\\;',./!@#$%^&*()_+{}|:"<>?]/.test(newValue) || newValue.trim().length === 0) {
      setCountryErrorChar(true)
    } else {
      setCountryErrorChar(false)
    }
    setCountryError(false);
    setFormData({ ...formData, country: newValue });
    setValues({ ...data, country: newValue }); //This update the context
  }


  const handlePhoneNumberChange = (e) => {
    const newValue = e.target.value.trim();

    if (/^\+?\d{0,3}?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(newValue) && /^[\d+\-]*$/.test(newValue) && newValue.length <= 13) {
      setPhoneNumberError(false);
      setFormData({ ...formData, phoneNumber: newValue });
      setValues({ ...data, phoneNumber: newValue }); //This update the context
    } else {
      setPhoneNumberError(true);
      return
    }
    if(newValue.trim().length === 0){
      setPhoneNumberError2(true);
    }else{
      setPhoneNumberError2(false);
    }
  };

  const handleEmailChange = (e) => {
    const newValue = e.target.value;
    // Common regular expressions for validations
    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const restrictedCharsRegex = /[!#$%&*\/=?^`{|}~\s]/;
  
    // Resetting errors initially
    setEmailError(false);
    setEmailError2(false);
  
    // Check if email is empty
    if (newValue.trim().length === 0) {
      setEmailError2(true);
    }
  
    // Check if email format is correct
    if (!emailFormatRegex.test(newValue)) {
      setEmailError(true);
    }

    // Check for restricted characters or excessive length
    if (restrictedCharsRegex.test(newValue) || newValue.length > 50) {
      setEmailError(true);
    }
    
  
    // If all checks are passed, update the email in form data and context
    setFormData(prevData => ({ ...prevData, email: newValue }));
    setValues(prevData => ({ ...prevData, email: newValue })); // This updates the context
  };

  // const handleDateChange = (e) => {
  //   const newValue = e.target.value;
  //   setFormData({ ...formData, dateVisited: newValue });
  //   setValues({ ...data, dateVisited: newValue }); //This update the context
  // };

  // const handleSubmit = () =>{
  //   navigate("/reportgenerated", { state: {formData} });
  // };

  const handleSubmit = async () => {
    if (firstNameError ||
      firstNameErrorChar ||
      lastNameError ||
      lastNameErrorChar ||
      address1Error ||
      address1Error2 ||
      address2Error ||
      address2Error2 ||
      countryError ||
      countryErrorChar ||
      stateError ||
      data.state === "" ||
      // formData.state === "" ||
      cityError ||
      cityErrorChar ||
      zipcodeError ||
      zipcodeErrorChar ||
      phoneNumberError ||
      phoneNumberError2 ||
      emailError ||
      emailError2 
      // ||

      // data.firstname?.length < 1 ||
      // data.lastName?.length < 1 ||
      // data.address1?.length < 1 ||
      // data.address2?.length < 1 ||
      // data.country?.length < 1 ||
      // data.state?.length < 1 ||
      // data.city?.length < 1 ||
      // data.phoneNumber?.length < 1 ||
      // data.email?.length < 1 ||

      // formData.firstName.length < 1 ||
      // formData.lastName.length < 1 ||
      // formData.address1.length < 1 ||
      // formData.address2.length < 1 ||
      // formData.country.length < 1 ||
      // formData.state.length < 1 ||
      // formData.city.length < 1 ||
      // formData.phoneNumber.length < 1 ||
      // formData.email.length < 1 
      ) {
      setSubmitError(true)
      
    } else{
        // setOriginalData(data)
        navigate("/reportgenerated", { state: { isAdmin } });
    }
    // try {
    //   const response = await fetch('your-api-gateway-endpoint-url', {
    //     method: 'Put',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(formData)
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to submit data');
    //   }

      // If submission is successful, navigate to the next page
      // navigate("/reportgenerated", { state: { formData } });
    // } catch (error) {
    //   console.error('Error submitting data:', error);
    // }
  };

  // const isValidEmail = (email) => {
  //   const emailPattern = /\S+@\S+\.\S+/;
  //   return emailPattern.test(email);
  // };

  // const isValidPhoneNumber = (phoneNumber) => {
  //   const phoneNumberPattern = /^\+?\d{0,3}?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  //   return phoneNumberPattern.test(phoneNumber);
  // };

  console.log("Data pass to the context", data)

  const handleInputChange = (key, value)=>{
    setValues(prevState => ({
      ...prevState,
      [key]: value
    }));
  }

  const handleNavigate = () =>{
    setValues(originalData);
    navigate("/reportGenerated", { state: { isAdmin } });
  }

  console.log("Submit Error",
    firstNameError ||
    firstNameErrorChar ||
    lastNameError ||
    lastNameErrorChar ||
    address1Error ||
    address1Error2 ||
    address2Error ||
    address2Error2 ||
    countryError ||
    countryErrorChar ||
    stateError ||
    data.state === "" ||
    // formData.state === "" ||
    cityError ||
    cityErrorChar ||
    zipcodeError ||
    zipcodeErrorChar ||
    phoneNumberError ||
    phoneNumberError2 ||
    emailError ||
    emailError2 )


  return (
    <>
      <Helmet>
        <title>Edit Report</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>


      <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">
        <div className="flex justify-end w-full items-start gap-[2px] absolute top-0 rigth-0">
          <DropdownMenu />
        </div>
        <Sidebar1 isAdmin={isAdmin} className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
        <div className="flex flex-col w-full justify-center gap-7">

          <div className="flex flex-col gap-7 max-w-[1020px] w-full m-auto mt-[200px]">

            <Text size="md" as="p" className="!text-gray-900_01 !font-poppins text-2xl border-b-2">
              Client Information
            </Text>
            <div className="flex sm:flex-col gap-5  max-w-[1050px] w-full">

              <div className="flex flex-col items-start max-w-[500px] w-full gap-[2px] ">
                <Heading as="h1" className="uppercase">
                  First Name
                </Heading>
                <input
                  value={data.firstName}
                  onChange={(e) => {
                    // handleInputChange("firstName", e.target.value)
                    handleFirstNameChange(e)}}
                  placeholder={`Enter Client First Name`}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
                {firstNameError && <Text size="xs" className="text-red-500">First name should not exceed 20 characters.</Text>}
                {firstNameErrorChar && <Text size="xs" className="text-red-500">First Name field can't be empty and you can only use alphabetic characters.</Text>}

              </div>

              <div className="flex flex-col items-start max-w-[500px] w-full gap-[2px]">
                <Heading as="h2" className="uppercase">
                  Last Name{" "}
                </Heading>
                <input
                  value={data.lastName}
                  onChange={(e) => {
                    // handleInputChange("lastName", e.target.value)
                    handleLastNameChange(e)}}
                  placeholder={`Enter Client Last Name `}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
                {lastNameError && <Text size="xs" className="text-red-500">Last name field should not exceed 30 characters.</Text>}
                {lastNameErrorChar && <Text size="xs" className="text-red-500">Last Name field can't be empty and you can only use alphabetic characters.</Text>}
              </div>
            </div>


            <Text size="md" as="p" className="!text-gray-900_01 !font-poppins ">
              Address
            </Text>

            <div className="flex flex-col self-stretch items-start gap-[2px] max-w-[1020px] w-[100%] ">
              <Heading as="h5" className="uppercase">
                Street Address
              </Heading>
              <input
                value={data.address1}
                onChange={(e) => {
                    // handleInputChange("address1", e.target.value)
                    handleAddress1Change(e)}}
                placeholder={`Enter Client Street Address`}
                className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
              />
              {address1Error && <Text size="xs" className="text-red-500">Street Address field should not exceed 40 characters. Make sure you divide the address between Address 1 and Address 2.</Text>}
              {address1Error2 && <Text size="xs" className="text-red-500">Street Adress field can't be empty.</Text>}
              
            </div>
            <div className="flex flex-col items-start gap-[2px] max-w-[1020px] w-[100%] ">
              <Heading as="h6" className="uppercase">
                Apartment, Suite, Unit, Building, Floor
              </Heading>
              <input
                value={data.address2}
                onChange={(e) => {
                    // handleInputChange("address2", e.target.value)
                    handleAddress2Change(e)}}
                placeholder={`Apt., Suite, Unit, Building, Floor (Optional)`}
                className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal "
              />
              {address2Error && <Text size="xs" className="text-red-500">Apartment, Suit, unit, Building, Floor field should not exceed 40 characters. Make sure you divide the address between Address 1 and Address 2.</Text>}
              {address2Error2 && <Text size="xs" className="text-red-500">Apartment, Suit, unit, Building, Floor field can't be empty.</Text>}

            </div>
            <div className="flex sm:flex-col self-stretch gap-5">
              <div className="flex flex-col items-start gap-[2px] max-w-[500px] w-full">
                <Heading as="h2" className="uppercase">
                  City
                </Heading>
                <input
                  name="City"
                  placeholder={`Enter Client City `}
                  value={data.city}
                  onChange={(e) => {
                    // handleInputChange("city", e.target.value)
                    handleCityChange(e)}}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal"
                />
                {cityError && <Text size="xs" className="text-red-500">City should not exceed 46 characters</Text>}
                {cityErrorChar && <Text size="xs" className="text-red-500">City field can't be empty and you can only use alphabetic characters.</Text>}

              </div>
              <div className="flex flex-col items-start max-w-[500px] w-full gap-[2px]">
                <Heading as="h2" className="uppercase">
                  State
                </Heading>
                <SearchableDropdown

                  shape="round"
                  type="text"
                  placeholder={`Enter Client State `}
                  defaultValue={data.state}
                  selectedOption={data.state}
                  handle={handleStateChange}
                  className="self-stretch sm:pr-5 font-poppins max-w-[500px] w-full" />
                {stateError && <Text size="xs" className="text-red-500">State field can't be empty. Please, select a State.</Text>}
              </div>
            </div>
            <div className="flex sm:flex-col self-stretch gap-5 max-w-[1020px] w-full">
              
              <div className="flex flex-col items-startgap-[2px] max-w-[500px] w-full">
                <Heading as="h2" className="uppercase">
                  Zip Code
                </Heading>
                <input
                  name="Zipcode"
                  placeholder={`Enter Client Zipcode `}
                  value={data.zipcode}
                  onChange={(e) => {
                    // handleInputChange("zipcode", e.target.value)
                    handleZipcodeChange(e)}}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal"
                />
                {zipcodeError && <Text size="xs" className="text-red-500">Zipcode should not exceed 9 characters.</Text>}
                {zipcodeErrorChar && <Text size="xs" className="text-red-500">Zipcode field can't be empty and you can only use numbers.</Text>}

              </div>
              <div className="flex flex-col items-start max-w-[500px] w-full gap-[2px]">
                <Heading as="h1" className="uppercase">
                  Country
                </Heading>
                <input
                  value={data.country}
                  onChange={(e) => {
                    // handleInputChange("country", e.target.value)
                    handleCountryChange(e)}}
                  placeholder={`Enter Client Country`}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal"
                />
                {countryError && <Text size="xs" className="text-red-500">Country should not exceed 20 characters</Text>}
                {countryErrorChar && <Text size="xs" className="text-red-500">Country field can't be empty and you can use only alphabetic characters</Text>}

              </div>
            </div>
            <Text size="md" as="p" className="!text-gray-900_01 !font-poppins">
              Contact
            </Text>
            <div className="flex sm:flex-col gap-5 max-w-[1020px]">
              <div className="flex flex-col items-start gap-[2px] max-w-[500px] w-full ">
                <Heading as="h3" className="uppercase">
                  Phone
                </Heading>
                <input
                  name="phone"
                  placeholder={`78712324567`}
                  value={data.phoneNumber}
                  onChange={(e) => {
                    handleInputChange("phoneNumber", e.target.value)
                    handlePhoneNumberChange(e)}}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal"
                />
                {phoneNumberError && <Text size="xs" className="text-red-500">Enter a valid phone number.</Text>}
                {phoneNumberError2 && <Text size="xs" className="text-red-500">Phone field can't be empty.</Text>}
              </div>
              <div className="flex flex-col items-start gap-[2px] max-w-[500px] w-full">
                <Heading as="h4" className="uppercase">
                  Email
                </Heading>
                <input
                  name="email"
                  placeholder={`Example@email.com`}
                  value={data.email}
                  onChange={(e) => {
                    // handleInputChange("email", e.target.value)
                    handleEmailChange(e)}}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal"
                />
                {emailError && <Text size="xs" className="text-red-500">Enter a valid email.</Text>}
                {emailError2 && <Text size="xs" className="text-red-500">Email field can't be empty.</Text>}
              </div>
            </div>
            {/* <div className="flex md:flex-col self-stretch gap- "> */}
            {/* <div className="flex flex-col items-start gap-[2px] max-w-[500px]">
              <Heading as="h3" className="uppercase">
                Inspection Date
              </Heading>
              <div className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "> 
              <input
                // shape="round"
                type="date"
                name="date"
                placeholder={`mm/dd/yyyy`}
                onChange={(e) => handleDateChange(e)}
                className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
              />
              { dateError && <Text size="xs" className="text-red-500">date Error</Text>}
              </div>
              
            </div> */}
            {/* </div> */}
          </div>
          <div className="m-auto mb-[20px] flex justify-between w-full max-w-[500px]">
            <button
              onClick={handleSubmit}
              className="p-2 sm:px-5 font-dmsans font-bold min-w-[159px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700">
              Confirm Changes
            </button>
            <button
              onClick={handleNavigate}
              className="p-2 font-dmsans font-bold min-w-[159px] rounded-[24px] bg-zinc-300 hover:bg-zinc-400">             
              Cancel
            </button>
          </div>
          {/* </div> */}
        </div>
      </div>
      {submitError && <Modal toggleModal={() => setSubmitError(!submitError)} />}

    </>
  );
}

