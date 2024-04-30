import React, { useState, useEffect, useRef, } from "react";
import { Helmet } from "react-helmet";
import Sidebar1 from "../components/SideBar";
import DropdownMenu from "../components/DropDown";
import PDFDocument from "../components/pdfDocumentView"
import { PDFViewer, BlobProvider, } from '@react-pdf/renderer';
import IsSignedMessageModal from "../components/Modals/IsSignedMessage"
import Modal from "../components/Modals/SignatureModal"
import { useContext, } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { reportGenerationContext } from "../components/Context";
import setData from "../Routes"
import { downloadData, } from 'aws-amplify/storage';
import FadeLoader from "react-spinners/ClipLoader";


export default function ReportGeneratedPage() {
  //   const [collapsed, setCollapsed] = React.useState(true);
  let imageSignatureURL = "";
  const [signature, setSignature] = useState();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;

  const [url, setUrl] = useState();

  const signatureCanvasRef = useRef(null);

  const [modal, setModal] = useState(false);

  const [formData, setFormData] = useState({}); // State to hold form data

  const { data, setValues } = useContext(reportGenerationContext);

  const navigate = useNavigate();

  const [isSigned, setIsSigned] = useState(false);

  const [isSignedMessage, setIsSignedMessage] = useState(false);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blob, setBlob] = useState("");
  const [isEdit, setIsEdit] = useState(false);

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

  const MyDoc = (
    <reportGenerationContext.Provider value={{ data, setValues: setData }}>
      <PDFDocument signature={url} isSigned={isSigned} />
    </reportGenerationContext.Provider>);

  // const blob = pdf(MyDoc).toBlob();

  const [base64, setBase64] = useState("");
  
//MODIFY THE DATA OBJECT SO THEY CAN PASS THE CORRESPONDING VARIABLES
const userID = localStorage.getItem('userID')
useEffect(() => {
  const result = calculateBrokenPipes(data.images);
  console.log('total of broken pipes', result)

  setValues({...data, brokenPipes: result})
  console.log("Value Set",data)

  
  fetchData(); // Call the async function
}, [])

const fetchData = async () => {
  setIsLoading(true)
  try {
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/users/${userID}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    setItems(responseData); // Set fetched data into state
    
    const user = responseData.user;
    if (responseData.user) {
      
      console.log("USER ID FROM LOCAL STORAGE",userID)
      setPersonalInfo({ ...personalInfo, firstName: user.FirstName, lastName: user.LastName, phoneNumber: user.PhoneNumber, email: user.Email, userId: user.User_ID, signature: user.Signature_URL });
      console.log("DATA BEFORE SET VALUES",responseData)
      setValues({...data, inspectorFirstName: user.FirstName + " " + user.LastName, inspectorPhoneNumber: user.PhoneNumber, inspectorEmail: user.Email})
      if(user.Signature_URL !== null){
      downloadImage(user.Signature_URL);
    }
  }
  setIsLoading(false); // Set loading to false once data is loaded

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    setError(error.message);
    setIsLoading(false);
  }
}

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
    setUrl(imgURL);

    console.log("BLOB:", blob)
    console.log('Succeed: ', blobThing);
  } catch (error) {
    console.log('Error : ', error);
  }
} 

//save the address in the db
  const handleUploadAddress = async () => {
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/address`
    const dataToSend = {
      Country: data.country,
      u_State: data.state,
      City: data.city,
      Street: data.address1,
      DoorNumber: data.address2,
      ZipCode: data.zipcode,
    };
    console.log("DATA TO SEND",JSON.stringify(dataToSend));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
      const result = await response.json();
      console.log('Address uploaded successfully:', result);
      return result.address;
    } catch (error) {
      console.error('There was an error uploading the Address:', error);
    }
  }
  //save the information of the client in the db
  const handleUploadClient = async (Address_ID) => {
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/clients`
    const dataToSend = {
      Address_ID: Address_ID,
      FirstName: data.firstName,
      LastName: data.lastName,
      PhoneNumber: data.phoneNumber,
      Email: data.email,
    };
    console.log("Data to send from Client",JSON.stringify(dataToSend));
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
      const result = await response.json();
      console.log('Client information uploaded successfully:', result);
      return result.client;
    } catch (error) {
      console.error('There was an error uploading the client information:', error);
    }
  }

  //save the information of the report in the db
  const handleUploadReport = async (Client_ID, Report_URL) => {
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/reports`
    const dataToSend = {
      User_ID: userID,
      Client_ID: Client_ID,
      r_Date: data.date,
      NumberOfBrokenPipes: data.brokenPipes,
      InspectorComments: data.comments,
      Report_URL: Report_URL //This Url is from the S3 bucket
    };
    console.log("Data to send from Report",JSON.stringify(dataToSend));
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
      const result = await response.json();
      console.log('Report information uploaded successfully:', result);
      return result.report;
    } catch (error) {
      console.error('There was an error uploading the report information:', error);
    }
  }
  // save the image url in the db
  const handleUploadImages = async (Report_ID) => {
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/images`
    const dataToSend = {
      Report_ID: Report_ID,
      images: data.images,
      // [
      //   {
      //     i_URL: "https://example.com/images/pipe1.jpg",
      //     is_Broken: 1,
      //     pipeName: "Pipe1"
      //   },
      //   {
      //     i_URL: "https://example.com/images/pipe2.jpg",
      //     is_Broken: 0,
      //     pipeName: "Pipe2"
      //   }
      // ]
    };
    console.log("Data to send from uploaded images",JSON.stringify(dataToSend));
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
      const result = await response.json();
      console.log('Images uploaded successfully in the S3:', result);
      return result;
    } catch (error) {
      console.error('There was an error uploading the images in the S3:', error);
    }
  }

  //Save the pdf in the S3
  const handleUploadPDF = async (pdf) => {
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/s3bucket/reports`
    const data = {
      pdf_data_url: pdf,
    };
    console.log("Data to send from PDF to S3",JSON.stringify(data));
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
      console.log('Pdf uploaded successfully in S3:', result);
      return result;
    } catch (error) {
      console.error('There was an error uploading the pdf in the S3:', error);
    }
  }
  //Save the signature in the S3
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

  const handleExtractURL = (url) =>{
    const imgURL = 'https://bitbusters-images-and-mlmodel-data.s3.amazonaws.com/';
    console.log("imgURL", imgURL);
    return imgURL.slice(imgURL.length)
  }

  const handleSaveSignature = (signatureRef) => {
    setSignature(signatureRef?.toDataURL());
  };

  const handleClear = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear(); // Access the clear method through the ref
    }
    console.log(signatureCanvasRef)
  };


  const handleGenerate = async () => {
    if (signatureCanvasRef.current && !signatureCanvasRef.current.isEmpty() && personalInfo.signature === null && !isSigned) {
      setIsLoading(true);
      setUrl(signatureCanvasRef.current.getTrimmedCanvas().toDataURL('image/png'));
      const address_info = await handleUploadAddress();
      const client_info = await handleUploadClient(address_info.Address_ID)
      console.log("base64 before enter in HANDLEUPLOADPDF",data.pdfBase64)
      console.log("base64 before enter in HANDLEUPLOADPDF with base64 variable",base64)
      await handleUploadSignature(signatureCanvasRef.current.getTrimmedCanvas().toDataURL(`${personalInfo.userId}/${personalInfo.firstName}/${personalInfo.lastName}/signature/png`));
      await handleUpdate()
      await fetchData();
      // const pdf_url = await handleUploadPDF(data.pdfBase64)
      // const report_info = await handleUploadReport(client_info.Client_ID, pdf_url.uploaded_url)
      // const images_in_db = await handleUploadImages(report_info.Report_ID)
      console.log("everything posted");
      setIsSigned(true);
      // const upload_signature_to_S3 = await handleUploadSignature(signature)
    }

    if(isEdit && signatureCanvasRef.current && !signatureCanvasRef.current.isEmpty() && !isSigned){
      setIsLoading(true);
      setIsSigned(true);
      console.log("URL", personalInfo.toString(personalInfo.signature))
    const parts = personalInfo.signature.split('/')
    
    const bucket_name = parts[2].split('.')[0]

    const objectKey = parts.slice(3).join('/');

    console.log("parsing url", parts, bucket_name, objectKey);
    console.log("signature uploaded from handle generate", signatureCanvasRef.current.getTrimmedCanvas().toDataURL(`${personalInfo.userId}/${personalInfo.firstName}/${personalInfo.lastName}/signature/png`))
    await handleUpdateSignature(objectKey, signatureCanvasRef.current.getTrimmedCanvas().toDataURL(`${personalInfo.userId}/${personalInfo.firstName}/${personalInfo.lastName}/signature/png`));
    await handleUpdate();
    await fetchData();
  }

    if(personalInfo.signature != null && !isSigned){

      setIsSigned(true);
      console.log("Document Signed")
    }
      console.log("isSigned", isSigned)
  }


  // const handleSavePdf = async () =>{
  //   if (!pdfDoc) {
  //     console.error("PDF document not created yet.");
  //     return;
  //   }

  //   setPdfDoc(<PDFDocument signature={url}/>)
  //   const blob = await pdfDoc.toBlob();
  //   console.log(blob);
  // }

  const handleUrl = () => {
    // setUrl(undefined);
    setIsEdit(true)
    console.log("handleUrl", url);
  }

  const handlePopupModal = () => {

    setModal(!modal);
    console.log("modal value", modal);
  }

  const handlePopupIsSignedMessage = () => {

    setIsSignedMessage(!isSignedMessage);
    console.log("modal value", isSignedMessage);
  }

  const handleNavigate = () => {
    navigate("/editreport", { state: { isAdmin } });
  }

  const convertBlobToBase64 = (blob) => {
    console.log("Blob before generating", blob)
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    console.log("entering to the base64 converter")
    reader.onloadend = () => {
      setBase64(reader.result);
      setValues({...data, pdfBase64: reader.result})
      console.log("Document converted",base64)
    };
    reader.onerror = (error) => {
      console.error('Error converting blob to base64:', error);
    };
    console.log("Base64",base64)

  };

  function calculateBrokenPipes(data) {
    let brokenPipesCount = 0;
  
    // Loop through each pipe (pipe1 and pipe2)
    for (const pipe in data) {
      for (const item of data[pipe]) {
        const predictions = item.predictions;
  
        // Check if the first prediction is less than the second
        if (predictions[0] < predictions[1]) {
            brokenPipesCount++;
          break; // Only count one broken pipe per pipe
        }
      }
    }
    return brokenPipesCount;
  }


  // console.log("url: ", url);

  console.log("Context Data", data);
  console.log("Personal Info", personalInfo);
  // console.log("is Signed Message", isSignedMessage);
  // console.log("BLOB", blob.url);
  return (

    <>

      {/* {console.log("data from report generated: ", formData)} */}
      <Helmet>
        <title>Report Generated</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>

      <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">

        <div className="flex justify-end w-full items-start gap-[2px] absolute top-0 rigth-0">
          <DropdownMenu />
        </div>

        <Sidebar1 isAdmin={isAdmin} className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />

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
        <div className="flex flex-col justify-center gap-7 ml-auto mr-auto w-full h-full mt-[70px]">

          <div className="h-[800px]">
            <PDFViewer className="w-[80%] h-full m-auto border" showToolbar={false}>
              {/* <reportGenerationContext.Provider value={{ data, setValues: setData }}>
                <PDFDocument signature={url} />
              </reportGenerationContext.Provider> */}
              {MyDoc}
            </PDFViewer>
          </div>

          <div className="flex justify-between w-full mt-[20px] max-w-[750px] m-auto mb-[50px]">

            {isSigned ?
              <button className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700" onClick={() => { handlePopupIsSignedMessage(); }}>
                Edit Report
              </button>
              : <button className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700" onClick={handleNavigate}>
                Edit Report
              </button>
            }


            <button className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-gray-500 hover:bg-gray-400 text-white-A700" onClick={handlePopupModal}>
              Sign Document
            </button>
            {isSigned ? (
              //   <PDFDownloadLink document={<reportGenerationContext.Provider value={{ data, setValues: setData }}>
              //     <PDFDocument signature={url} />
              //   </reportGenerationContext.Provider>} fileName="report.pdf" className="justify-center text-center p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700">
              //     {({ blob, url, loading, error }) => 
              //       loading ? 'Loading document...' : 'Export to pdf'

              // }
              //   </PDFDownloadLink>

              <BlobProvider document={MyDoc}>
                {({ blob, url, loading, error }) => {
                  if (loading) {
                    return <div>Loading document...</div>;
                  }
                  if (error) {
                    return <div>Error generating document: {error.message}</div>;
                  }
                  if (blob && !base64) {  // Check if base64 is not already set
                    convertBlobToBase64(blob);
                  }
                  return( 
                    <div className="Border">
                      <a href={url} download="somename.pdf" className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] text-center bg-indigo-700 hover:bg-blue-400 text-white-A700">Export to pdf</a>
                      {/* {base64 && <textarea style={{ width: '100%', height: '200px' }} value={base64} readOnly />} */}
                      {console.log("blob",blob)}
                      {console.log("Base64",base64)}
                    </div>
                  );
                }}
              </BlobProvider>
            ) : (
              <button className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700" onClick={() => { handlePopupIsSignedMessage(); }}>
                Export to pdf
              </button>
            )}
          </div>
          <div>
            {isSignedMessage && <IsSignedMessageModal toggleModal={() => setIsSignedMessage(!isSignedMessage)} isSigned={isSigned} />}
            {modal && <Modal signatureCanvasRef={signatureCanvasRef} url={blob} toggleModal={() => setModal(!modal)} handleClear={handleClear} 
            handleGenerate={async () => {
              try {
                await handleGenerate();
              } catch (error) {
                console.error('Error generating:', error);
              }
            }}
              handleUrl={handleUrl} 
              handleIsEdit={() => setIsEdit(false)}
              isEdit= {isEdit}
              isSigned ={isSigned}
              />}

          </div>
        </div>
}
      </div>
    </>
  );
}