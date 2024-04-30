import React, {useState} from "react";
import { Helmet } from "react-helmet";
import { Heading, Text,} from "../components";
import Sidebar1 from "../components/SideBar";
import DynamicInput from "../components/DynamicInput"
import SearchableDropdown from "../components/inputWithSearch"
import DropdownMenu from "components/DropDown";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { reportGenerationContext } from "../components/Context";

export default function ReportGenerationOnePage() {
  const navigate = useNavigate();

  const { data, setValues } = useContext(reportGenerationContext);

  const [formData, setFormData] = useState(
    {
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
    phoneNumber: "",
    email: "",
    date: "",
  })

  // Set Errors ------------------------------------------------------------

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [address1Error, setAddress1Error] = useState(false);
  const [address2Error, setAddress2Error] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [zipcodeError, setZipcodeError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  // const [dateError, setDateError] = useState();

  
// Handlde Errors ----------------------------------------------------------

  const handleFirstNameChange = (e) => {
    const newValue = e.target.value;
    
    if (newValue.length > 20) {
      setFirstNameError(true);
      return
    } 
    setFirstNameError(false);
    setFormData({ ...formData, firstName: newValue});
    setValues({...data, firstName: newValue}); //This update the context
  };

  const handleLastNameChange = (e) => {
    const newValue = e.target.value;
    
    if (newValue.length > 30) {
      setLastNameError(true);
      return
    } 
    setLastNameError(false);
    setFormData({ ...formData, lastName: newValue});
    setValues({...data, lastName: newValue}); //This update the context
    
  };

  const handleAddress1Change = (e) =>{
    const newValue = e.target.value;
    
    if (newValue.length > 40) {
      setAddress1Error(true);
      return
    } 
    setAddress1Error(false);
    setFormData({ ...formData, address1: newValue});
    setValues({...data, address1: newValue}); //This update the context
  };

  const handleAddress2Change = (e) =>{
    const newValue = e.target.value;
    
    if (newValue.length > 40) {
      setAddress2Error(true);
      return
    } 
    setAddress2Error(false);
    setFormData({ ...formData, address2: newValue});
    setValues({...data, address2: newValue}); //This update the context
  };

  const handleCountryChange = (e) =>{
    const newValue = e.target.value;
    
    if (newValue.length > 56) {
      setCountryError(true);
      return
    } 
    setCountryError(false);
    setFormData({ ...formData, country: newValue});
    setValues({...data, country: newValue}); //This update the context
    }

  const handleStateChange = (selectedOption) =>{
    setFormData({ ...formData, state: selectedOption});
    setValues({...data, state: selectedOption}); //This update the context
  }

  const handleCityChange = (e) =>{
    const newValue = e.target.value;
    
    if (newValue.length > 46) {
      setCityError(true);
      return
    } 
    setCityError(false);
    setFormData({ ...formData, city: newValue});
    setValues({...data, city: newValue}); //This update the context
  }

  const handleZipcodeChange = (e) =>{
    const newValue = e.target.value;
    
    if (newValue.length > 9) {
      setZipcodeError(true);
      return
    } 
    setZipcodeError(false);
    setFormData({ ...formData, zipcode: newValue});
    setValues({...data, zipcode: newValue}); //This update the context
  }

  const handlePhoneNumberChange = (e) => {
    const newValue = e.target.value;
    
    if (/^[\d+\-]*$/.test(newValue)) {
      setPhoneNumberError(false);
      setFormData({ ...formData, phoneNumber: newValue});
      setValues({...data, phoneNumber: newValue}); //This update the context
    } else {
      setPhoneNumberError(true);
      return
    }
  };

  const handleEmailChange = (e) => {
    const newValue = e.target.value;
    // Check if email exceeds maximum length
    if (newValue.length > 50) {
      setEmailError(true);
      return
    }
    setEmailError(false);
    setFormData({ ...formData, email: newValue});
    setValues({...data, email: newValue}); //This update the context
  };

  const handleDateChange = (e) =>{
    const newValue = e.target.value;
    setFormData({ ...formData, dateVisited: newValue});
    setValues({...data, dateVisited: newValue}); //This update the context
  };

  const handleSubmit = () =>{
    navigate("/reportgenerated", { state: {formData} });
  };

  // const isValidEmail = (email) => {
  //   const emailPattern = /\S+@\S+\.\S+/;
  //   return emailPattern.test(email);
  // };

  // const isValidPhoneNumber = (phoneNumber) => {
  //   const phoneNumberPattern = /^\+?\d{0,3}?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  //   return phoneNumberPattern.test(phoneNumber);
  // };

  console.log("Data pass to the context",data) //CONSOLE LOG  ----------------------------------------

  return (
    <>
      <Helmet>
        <title>Report Generation</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>


      <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">
        {console.log(formData)}
        <div className="flex justify-end w-full items-start gap-[2px] absolute top-0 rigth-0">
          <DropdownMenu />
        </div>
        <Sidebar1 className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
        <div className="flex flex-col w-full justify-center gap-7">
          <div className="justify-center item-center flex flex-col max-w-[700px] m-auto mt-40 w-full gap-2">
            <DynamicInput />
          </div>
          <div className="m-auto">
            <button className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700">
              Analyze Images
            </button>
          </div>

          <div className="flex flex-col gap-7 max-w-[1020px] w-full m-auto">

            <Text size="md" as="p" className="!text-gray-900_01 !font-poppins text-2xl border-b-2">
              Client Information
            </Text>
            <div className="flex sm:flex-col gap-5  max-w-[1050px] w-full">

              <div className="flex flex-col items-start max-w-[500px] w-full gap-[2px] ">
                <Heading as="h1" className="uppercase">
                  First Name
                </Heading>
                <input
                  onChange={ (e) => handleFirstNameChange(e)}
                  placeholder={`Enter Client First Name`}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
                {firstNameError && <Text size="xs" className="text-red-500">First name should not exceed 20 characters.</Text>}
              </div>

              <div className="flex flex-col items-start max-w-[500px] w-full gap-[2px]">
                <Heading as="h2" className="uppercase">
                  Last Name{" "}
                </Heading>
                <input
                  onChange={ (e) => handleLastNameChange(e)}
                  placeholder={`Enter Client Last Name `}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
                {lastNameError && <Text size="xs" className="text-red-500">Last name should not exceed 30 characters.</Text>}
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
                onChange={ (e) => handleAddress1Change(e)}
                placeholder={`Enter Client Street Address`}
                className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
              />
              {address1Error && <Text size="xs" className="text-red-500">Address 1 should not exceed 40 characters. Make sure you divide the address between Address 1 and Address 2</Text>}
            </div>
            <div className="flex flex-col items-start gap-[2px] max-w-[1020px] w-[100%] ">
              <Heading as="h6" className="uppercase">
                Apartment, Suite, Unit, Building, Floor
              </Heading>
              <input
                onChange={ (e) => handleAddress2Change(e)}
                placeholder={`Apt., Suite, Unit, Building, Floor (Optional)`}
                className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
              />
              {address2Error && <Text size="xs" className="text-red-500">Address 2 should not exceed 40 characters. Make sure you divide the address between Address 1 and Address 2</Text>}
            </div>
            <div className="flex sm:flex-col self-stretch gap-5">
              <div className="flex flex-col items-start max-w-[500px] w-full gap-[2px]">
                <Heading as="h1" className="uppercase">
                  Country
                </Heading>
                 <input
                  onChange={(e) => handleCountryChange(e)}
                  placeholder={`Enter Client Country`}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                /> 
                {countryError && <Text size="xs" className="text-red-500">Country should not exceed 20 characters</Text>}
              </div>
              <div className="flex flex-col items-start max-w-[500px] w-full gap-[2px]">
                <Heading as="h2" className="uppercase">
                  State
                </Heading>
                <SearchableDropdown

                  shape="round"
                  type="text"
                  name="State"
                  placeholder={`Enter Client State `}
                  selectedOption={formData.state}
                  handle={handleStateChange}
                  className="self-stretch sm:pr-5 font-poppins max-w-[500px] w-full" />
                  {stateError && <Text size="xs" className="text-red-500">Select a State</Text>}
              </div>
            </div>
            <div className="flex sm:flex-col self-stretch gap-5 max-w-[1020px] w-full">
              <div className="flex flex-col items-start gap-[2px] max-w-[500px] w-full">
                <Heading as="h2" className="uppercase">
                  City
                </Heading>
                <input
                  placeholder={`Enter Client City `}
                  onChange={ (e) =>handleCityChange(e)}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
                { cityError && <Text size="xs" className="text-red-500">City should not exceed 46 characters</Text>}
              </div>
              <div className="flex flex-col items-startgap-[2px] max-w-[500px] w-full">
                <Heading as="h2" className="uppercase">
                  Zip Code
                </Heading>
                <input
                  placeholder={`Enter Client Zipcode `}
                  onChange={(e) => handleZipcodeChange(e)}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
                { zipcodeError && <Text size="xs" className="text-red-500">Zipcode should not exceed 9 characters</Text>}
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
                  onChange={(e) => handlePhoneNumberChange(e)}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
                { phoneNumberError && <Text size="xs" className="text-red-500">phone number error</Text>}
              </div>
              <div className="flex flex-col items-start gap-[2px] max-w-[500px] w-full">
                <Heading as="h4" className="uppercase">
                  Email
                </Heading>
                <input
                  name="email"
                  placeholder={`Example@email.com`}
                  onChange={(e) => handleEmailChange(e)}
                  className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
                />
                { emailError && <Text size="xs" className="text-red-500">Email Error</Text>}
              </div>
            </div>
            <div className="flex flex-col items-start gap-[2px] max-w-[500px]">
              <Heading as="h3" className="uppercase">
                Inspection Date
              </Heading>
              <div className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "> 
              <input
                type="date"
                name="date"
                placeholder={`mm/dd/yyyy`}
                onChange={(e) => handleDateChange(e)}
                className="self-stretch sm:pr-5 font-poppins border border-gray-300 box-border rounded-[4px] h-[48px] pl-4 hover:border-blue-500 hover:shadow-md font-normal font-[16px] "
              />
              </div>
            </div>
          </div>
          <div className="m-auto mb-[20px]">
            <button 
            onClick={handleSubmit}
            className="p-2 sm:px-5 font-dmsans font-bold min-w-[159px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700">
              View Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

