import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Heading, Text, } from "../components";
import Sidebar1 from "../components/SideBar";
import DynamicInput from "../components/DynamicInput"
import FadeLoader from "react-spinners/ClipLoader";
import SearchableDropdown from "../components/inputWithSearch"
import DropdownMenu from "../components/DropDown";
import { useNavigate,useLocation } from "react-router-dom";
import { reportGenerationContext } from "../components/Context";
import Modal from "../components/Modals/ReportGenerationModal";
// import TextField from '@mui/material/TextField';
// import { Button } from "@mui/material";
import { DragAndDropFile } from "../components/DragAndDropFile";

export default function ReportGeneratedTilesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;

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
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file

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

  const [submitError, setSubmitError] = useState(false);
  const [showInstructionContent, setShowInstructionContent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dragAndDropImagesParent, setDragAndDropImagesParent] = useState([]);
  const [currentPipeInProcess, setCurrentPipeInProcess] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [barloading, setBarLoading] = useState(false);

  const [enableButton, setEnableButton] = useState(true) ;
  const [enableAnalyze, setEnableAnalyze] = useState(false);
  const [errorScanning, setErrorScanning] = useState(false);
  const [errorUploading, setErrorUploading] = useState(false);
   // useEffect (() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 5000)
  // }, [])
  const showInstructions = () => {
    setShowInstructionContent(!showInstructionContent);
  };
  useEffect(() => {
    console.log("THIS IS THE GLOBAL MODEL RESPONSE:", data.images);
  }, [data.images]);

  const handleModelStructure = async (uploadedUrls) => {
    const modelResponseStructure = {}; // Object to store uploaded URLs

    console.log("Uploaded URLs Received for Model Call:", uploadedUrls);

    const totalNumberOfPipes = Object.keys(uploadedUrls).length;

    for (const pipe in uploadedUrls) {

      console.log("PROCEEDING WITH MODEL CALL", pipe);

      const currentPipe = pipe.match(/\d+/)[0];

      setCurrentPipeInProcess(currentPipe);

      console.log("CURRENT PIPE:", currentPipe);
      console.log("TOTAL NUMBER OF PIPES BEFORE DIVISION:", totalNumberOfPipes);
    
      const prediction = await handleModelCall(uploadedUrls[pipe]);
      if (prediction) {
        const readPrediction = await prediction.json()
        console.log("THIS IS THE Pipe Info TO BE SAVED:", readPrediction['pipeInfo']);
        console.log("THIS IS THE KEY THAT WILL STORE THE Pipe Info:", pipe);
        modelResponseStructure[pipe] = readPrediction['pipeInfo']; // Store S3 URL in the corresponding pipe object
      }

      setCurrentProgress((currentPipe/totalNumberOfPipes) * 100);
    }

    setLoading(false);

    console.log("Model Response Structured:", modelResponseStructure)

    return modelResponseStructure;
  }

  // const handleModelCall = async (pipeInfo) => {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       console.log("Calling The ML Model");
  //       fetch('https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/mlmodel', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({pipeInfo}),
  //       })
  //         .then((response) => {
  //           console.log("THIS IS THE ML MODEL FETCH RESPONSE:", response);
  //           if (response.status === 504) {
  //             // Handle the 504 error condition
  //             console.log("Gateway Timeout (504) error occurred");
  //             // Reject the promise with an error message
  //             reject("Gateway Timeout (504) error occurred");

  //             setErrorScanning(true);
  //             setEnableButton(true);

  //           } else if(response.status === 500){
  //             console.log("Image Processing (500) error occurred");

  //             reject("Image Processing (500) error occurred");

  //             setErrorScanning(true);
  //             setEnableButton(true);
  //           }
  //           else{
  //             resolve(response);
  //           }
  //         })
  //         .catch((error) => {
  //           setLoading(false);
  //           console.error('Error Calling the ML Model:', error);
  //           reject(error);
  //         });

  //       //console.log("THIS IS THE URL FETCH RESPONSE:", forModel)
  //     } catch (error) {
  //       setLoading(false);
  //       console.error('Error Calling the ML Model:', error);
  //       throw error; // Re-throw the error to handle it further up the chain
  //     }
  //   });
  // }

  const handleModelCall= async () => {
    // if (!selectedFile) {
    //   console.error('No file selected');
    //   return;
    // };

    const formData = new FormData();
    formData.append('model','tile-model');
    formData.append('image', dragAndDropImagesParent[0].url);
 
    console.log(formData.values());

    const resp = await fetch('https://aro53nc5zg.execute-api.us-east-1.amazonaws.com/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    

    // axios.post('https://aro53nc5zg.execute-api.us-east-1.amazonaws.com/upload', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // })
    //   .then(response => {
    //     setResult(response.data.result);
    //     const s3 = new AWS.S3({
    //       accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    //       secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    //     });
    //     const params = {Bucket: 'roofrx', Key: 
    //     response.data.classified_image_path};
    //     s3.getSignedUrl('getObject', params, function (err, url) {
    //       console.log(params);
    //       console.log(err)
    //       console.log("The URL is", url);
    //       setImresult(url);
    //     });
    //   })
    //   .catch(error => {
    //     console.error('Error uploading image:', error);
    //   });
  };

  const handleImagesUpload = async (toUpload) => {
    const uploadedUrls = {}; // Object to store uploaded URLs

    console.log("toUpload:", toUpload);

      for (const pipe in toUpload) {
        uploadedUrls[pipe] = {}; // Initialize pipe object
        let counter = 1;
        let key = `url${counter}`;

        console.log("PROCEEDING WITH PIPE", pipe);
    
        const urls = Object.values(toUpload[pipe]);
        for (const url of urls) {
          const uploadedUrl = await handleImageUploadS3(url);
          if (uploadedUrl) {
            const readUploadUrl = await uploadedUrl.json()
            console.log("THIS IS THE URL TO BE SAVED:", readUploadUrl.uploaded_url);
            console.log("THIS IS THE KEY THAT WILL STORE THE URL:", key);
            uploadedUrls[pipe][key] = readUploadUrl.uploaded_url; // Store S3 URL in the corresponding pipe object
            counter = counter + 1; // Generate key with counter
            key = `url${counter}`;
          }
        }
      }

      console.log("Uploaded URLS:", uploadedUrls)

      return uploadedUrls;
  }

  const handleImageUploadS3 = async (url) => {
    return new Promise((resolve, reject) => {
      try {
        fetch('https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/s3bucket/images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "pipe1": {
              "url1": url
            }
          }),
        })
          .then((response) => {
            console.log("THIS IS THE URL FETCH RESPONSE:", response);
            if (response.status !== 200) {
              // Handle the 504 error condition
              console.log( `The following error with status code: ${response.status} occurred`);
              // Reject the promise with an error message
              reject(`Error status code: ${response.status}`);

              setErrorUploading(true);
              setEnableButton(true);

            } 
            resolve(response);
          })
          .catch((error) => {
            console.error('Error uploading images to S3:', error);
            reject(error);
          });

        //console.log("THIS IS THE URL FETCH RESPONSE:", forModel)
      } catch (error) {
        console.error('Error uploading images to S3:', error);
        throw error; // Re-throw the error to handle it further up the chain
      }
    });
  }

  const handleImageStructureForUpload = async () => {
    const imageURLs = {}; // Store processed images

    console.log("ENTERING UPLOAD");

    // Double for loop to iterate over each array and elements inside each array
    for (let i = 0; i < dragAndDropImagesParent.length; i++) {
      const pipeKey = `pipe${i + 1}`; // Generate the pipe key dynamically
      imageURLs[pipeKey] = {}; // Initialize an empty object for each pipe

      for (let j = 0; j < dragAndDropImagesParent[i].length; j++) {
        const urlKey = `url${j + 1}`; // Generate the URL key dynamically

        const response = await fetch(dragAndDropImagesParent[i][j].url); // Fetch the Blob data using the URL
        const blob = await response.blob(); // Get the Blob object from the response

        imageURLs[pipeKey][urlKey] = await handleImageToUrl(blob); // Assign the URL to the corresponding key in the pipe object
      }
    }

    console.log("IMAGE URLS RESULT:", imageURLs)

    return imageURLs;
  }

  const handleImageToUrl = (image) => {
    return new Promise((resolve, reject) => {

      console.log("Image type:", typeof image); // Log the type of the image parameter
      console.log("Image object:", image); // Log the image object itself

      const file = image;
      const reader = new FileReader();
  
      reader.onload = () => {
        const imageUrl = reader.result;
        resolve(imageUrl); // Resolve the promise with the URL
      };
  
      reader.onerror = (error) => {
        reject(error); // Reject the promise if there's an error
      };
  
      reader.readAsDataURL(file);
    });
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAnalyzeImages = async () => {
    setErrorScanning(false);
    setErrorUploading(false);
    setBarLoading(true);
    setLoading(true);
    setCurrentProgress(0);
    setEnableButton(false);
    setEnableAnalyze(false);

    const formData = new FormData();
    formData.append('model','tile-model');
    formData.append('image', selectedFile);
 
    // console.log(formData.values());

    try {
      const response = await fetch('https://aro53nc5zg.execute-api.us-east-1.amazonaws.com/upload', {
        method: 'POST',
        body: formData,
      });

      const modelResponse = await response.json();

      if (modelResponse) {
        setLoading(false);
        setValues(data => ({ ...data, images: modelResponse }));
        setEnableButton(true);
        setEnableAnalyze(true);
        setCurrentProgress(100);
      }
    } catch (error) {
      console.error("Error in handleAnalyzeImages:", error);
      // Handle the error here, e.g., show a notification or display an error message
      setErrorScanning(true);
      // setErrorUploading(true);
    }

      // }
    // } catch (error) {
    //   console.error("Error in handleAnalyzeImages:", error);
    //   // Handle the error here, e.g., show a notification or display an error message
    // }
  }

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
      
    } else {
      setLastNameError(false);
    }
    if (/[~`1234567890\-=[\]\\;',./!@#$%^&*()_+{}|:"<>?]/.test(newValue) || newValue.trim().length === 0) {
      setLastNameErrorChar(true)
      
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
        // navigate("/reportgenerated", { state: { formData, isAdmin } });
        navigate("/results", { state: { formData, isAdmin } });

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

  const handleInputChange = (key, value)=>{
    setValues(prevState => ({
      ...prevState,
      [key]: value
    }));
  }

  const WithLabelExample = () => {
    const currentValue = Number(currentProgress.toFixed(2));
    if(currentProgress == 100) {
    //   return (
    //   <div className="w-full max-w-[1020px] m-auto" style={{ width: '100%', backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '2px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}>
    //     <div
    //       style={{
    //         width: `${currentValue}%`,
    //         height: '20px',
    //         backgroundColor: '#007bff',
    //         borderRadius: '5px',
    //         transition: 'width 0.3s ease-in-out',
    //       }}
    //     >
    //       <span
    //         style={{
    //           display: 'flex',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           height: '100%',
    //           color: 'white',
    //           fontWeight: 'bold',
    //           fontSize: '14px',
    //         }}
    //       >
    //         {currentValue}%
    //       </span>
    //     </div>
    //   </div>
    // );}
    // else{
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#52c41a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </div>
          <div style={{ fontSize: '18px', color: '#333', fontWeight: 'bold' }}>Done Analyzing!</div>
        </div>
      );
    }
  }

  console.log("Data pass to the context", data)
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
        <Sidebar1 isAdmin={isAdmin} className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
        <div className="flex flex-col w-full justify-center gap-7">
          <div className="justify-center item-center flex flex-col max-w-[700px] m-auto mt-40 w-full gap-2">
          <div className="instructions-container pb-10">
          <button onClick={showInstructions}>Instructions<span>&#9660;</span></button>
          {showInstructionContent && (
            <div id="instructionContent">
              <h1>To generate a report:</h1>
              <ol>
                <li>
                  <strong>1) Upload Images:</strong> Select and upload images for analysis.
                </li>
                <li>
                  <strong>2) Analyze Images:</strong> Press the "Analyze Images" button after uploading to initiate the analysis process. You will be notified when the analysis is done.
                </li>
                <li>
                  <strong>3) Fill Client Information:</strong> Enter client details such as name, address, and contact information in the respective fields. Ensure all required fields are completed before proceeding with view results.
                </li>
              </ol>
            </div>
    )}
    </div>
            {/* <DynamicInput handleDragAndDropImagesParent={setDragAndDropImagesParent} enableButton={enableButton}/> */}
          </div>
          <div className="m-auto">
            {/* {  
        console.log("dragAndDropImagesParent", (fetch(dragAndDropImagesParent[0].url).blob()))} */}
          {/* <DragAndDropFile
                pipeIndex={0}
                // pipeNumbers={1}
                addToImageList={(newImageList) => {
                  setDragAndDropImagesParent((prevImages) =>  [newImageList]
                  // {
                  //   // const updatedImages = [...prevImages];
                  //   // updatedImages[0] = [...prevImages[0] || [], ...newImageList.images]; // Concatenate existing and new images
                  //   // console.log("added dragAndDropImages:", updatedImages); 
                  //   // return updatedImages;
                  // }
                );
                }}
                deleteFromImageList={(newImageList) => setDragAndDropImagesParent([])}
                images={dragAndDropImagesParent[0]}
                enableButton= {enableButton}
            /> */}
          {/* <TextField type="file" onChange={(e) => console.log(e.target.files)}/> */}

          {selectedFile && (
      <img src={URL.createObjectURL(selectedFile)} alt="Selected" height={700} width={800} />
    )}
    <input type='file' onChange={handleFileChange} />
    </div>
    <div className="m-auto">
            <button className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700" onClick={handleAnalyzeImages}>
              Analyze Images
            </button>

            {barloading && !errorScanning && !errorUploading &&
              <div className="flex justify-center mt-[20px]">
                <FadeLoader
                  color={"303F9F"}
                  loading={loading}
                  size={75}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            }


          </div>

          {barloading && !errorScanning && !errorUploading && <WithLabelExample />}

          {errorScanning && (
            <div className="text-center text-red-600 font-bold mt-4">
              Failed to scan images, please try again!
            </div>
          )}

          {errorUploading && (
            <div className="text-center text-red-600 font-bold mt-4">
              Failed to upload images, please try again!
            </div>
          )}

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
          <div className="m-auto mb-[20px]">
            {enableAnalyze && <button
              onClick={ () => {enableButton && handleSubmit()}}
              className="p-2 sm:px-5 font-dmsans font-bold min-w-[159px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700">
              View Results
            </button>}
          </div>
        </div>
      </div>
      {submitError && <Modal toggleModal={() => setSubmitError(!submitError)} />}

    </>
  );
}