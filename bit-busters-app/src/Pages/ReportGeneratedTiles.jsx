import React, { useState, useEffect, useRef, } from "react";
import { Helmet } from "react-helmet";
import Sidebar1 from "../components/SideBar";
import DropdownMenu from "../components/DropDown";
import PDFDocument from "../components/pdfDocumentView"
import { PDFViewer, BlobProvider } from '@react-pdf/renderer';
import IsSignedMessageModal from "../components/Modals/IsSignedMessage"
import Modal from "../components/Modals/SignatureModal"
import { useContext, } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { reportGenerationContext } from "../components/Context";
import setData from "../Routes"
import { downloadData, } from 'aws-amplify/storage';
import FadeLoader from "react-spinners/ClipLoader";
import {pdf, usePDF, renderToStream} from '@react-pdf/renderer';
// const puppeteer = require('puppeteer-core');
// const fs = require('fs');
// const pdf = require('html-pdf');
// const fs = require('fs');
// const path = require('path');
// const pdf = require('html-pdf');
//import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';
//import streamToBlob from 'stream-to-blob';
// import { renderToStaticMarkup } from 'react-dom/server';
// import ReactDOMServer from 'react-dom/server';
// import jsPDF from 'jspdf';

export default function ReportGeneratedTiles() {
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
  const [enableGenerate, setEnableGenerate] = useState(false);
  const [callGenerate, setCallGenerate] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blob, setBlob] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
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

  const [,forceRender] = useState(0);
  const [base64Blob, setBase64Blob] = useState(null)
  const[isSaved, setIsSaved] = useState(false);
  const[clientInfo, setClientInfo] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);

  console.log("DATA====================================================================:", data);

  console.log("DATA IMAGES MYDOC", data.images);
  
  const MyDoc = (
    <reportGenerationContext.Provider value={{ data, setValues: setData }}>
      <PDFDocument signature={url} isSigned={isSigned} />
    </reportGenerationContext.Provider>);

useEffect(() => {
  if(isSigned){
    data.date = new Date().toLocaleDateString(); // Get current date    
  }
  else{
    data.date = "";
  }
})

useEffect(() => {
  const savedData =  window.localStorage.getItem("data")
  const savedDataParse = savedData ? JSON.parse(savedData) : null;
  console.log("JSON.parse(savedData)",JSON.parse(savedData))
  console.log("savedDataParse",savedDataParse)
  console.log(data)
  if (data) setValues({...data, ...savedDataParse})
 //  console.log("data",data)
 }, [])
 useEffect(() => {
  const handleBeforeUnload = (e) => {
    e.preventDefault();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);
 useEffect(() => {
   window.localStorage.setItem("data", JSON.stringify(data))
   console.log(JSON.stringify(data))
   console.log(data)
 }, [data])

  // const blobFiles = await pdf(MyDoc).toBlob();

  const [base64, setBase64] = useState("");

  useEffect(() => {
    if(pdfBlob){
      console.log("BLOB USE EFFECT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", pdfBlob);
      // const base64Blob = convertBlobToBase64(pdfBlob);
      // setBase64Blob(base64Blob);
    }
  }, [pdfBlob])
  
//MODIFY THE DATA OBJECT SO THEY CAN PASS THE CORRESPONDING VARIABLES
const userID = localStorage.getItem('userID')
useEffect(() => {
  // const result = calculateBrokenPipes(data.images);
  // console.log('total of broken pipes', result)

  // setValues({...data, brokenPipes: result})
  // console.log("Value Set",data)

  
  fetchData(); // Call the async function
}, [])

// const updateData = async (data) => {
//   const updatedData = await replaceS3UrlsWithBlobs(data);
//   await setValues(updatedData);
//   return updateData;
// };

const handleConfirmSubmission = async (blob) => {
  // Add your submission logic here
  await handleUploadPDF(blob);
  // Close the confirmation popup
  setShowConfirmation(false);

  if(isAdmin){
    navigate("/adminhome", { state: { isAdmin } });
  }
  else{
    navigate("/home", { state: { isAdmin } });
  }
  
};

const replaceS3UrlsWithBlobs = async (data) => {
  const updatedData = {...data}; // Create a shallow copy of data

  console.log("DATA TO S3==============================================:", data);

  console.log("UPDATED DATA BEFORE UPDATING ====================================:", updatedData);

  for (const pipe in data) {
    updatedData[pipe] = [];

    for (const item of data[pipe]) {
      const imageUrl = item.url;
      const blob = await downloadImageFromS3(imageUrl);
      const objectURL = URL.createObjectURL(blob);
      console.log("Created BLOB URL", objectURL);
      updatedData[pipe].push({ ...item, url: objectURL });
    }
  }

  return updatedData;
};

const downloadImageFromS3 = async (s3Url) => {
  const url = s3Url;
  const parts = url.split('/');
  const bucket_name = parts[2].split('.')[0];
  const objectKey = parts.slice(4).join('/');
  const downloadResult = await downloadData({ key: objectKey }).result;

  console.log("DOWNLOAD RESULT +++++++++++++++++++++++++++++++++++++++++++++++++++++:", downloadResult);
  const blobThing = await downloadResult.body.blob();

  return blobThing;
}

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
      setValues({...data, inspectorFirstName: user.FirstName + " " + user.LastName, inspectorPhoneNumber: user.PhoneNumber, inspectorEmail: user.Email, brokenPipes: data.images.result} )
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
    setIsLoading(true)
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
      setIsLoading(false)
      return result.address;
    } catch (error) {
      console.error('There was an error uploading the Address:', error);
      setIsLoading(false)
    }
  }
  //save the information of the client in the db
  const handleUploadClient = async (Address_ID) => {
    setIsLoading(true)
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
      setIsLoading(false)
      return result.client;
    } catch (error) {
      console.error('There was an error uploading the client information:', error);
      setIsLoading(false)
    }
  }

  //save the information of the report in the db
  const handleUploadReport = async (Client_ID, pdf) => {
    setIsLoading(true)
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/reports`
    const dataToSend = {
      User_ID: userID,
      Client_ID: Client_ID,
      r_Date: data.date,
      NumberOfBrokenPipes: data.brokenPipes,
      InspectorComments: data.comments,
      Price: data.price,
      Report_URL: pdf //This Url is from the S3 bucket
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
      setIsLoading(false)
      return result.report;
    } catch (error) {
      console.error('There was an error uploading the report information:', error);
      setIsLoading(false)
    }
  }
  // save the image url in the db
  const handleUploadImages = async (Report_ID) => {
    setIsLoading(true)
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
      setIsLoading(false)
      return result;
    } catch (error) {
      console.error('There was an error uploading the images in the S3:', error);
      setIsLoading(false)
    }
  }

  //Save the pdf in the S3
  const handleUploadPDF = async (pdf) => {
    // while (!pdfBlob){
    //   console.log("BLOB IN WHILE", pdfBlob);
    //   forceRender(n => n + 1);
    // }

    console.log("PDF RECEIVED FOR S3 *********************************************", pdf);

    const base64PDF = await convertBlobToBase64(pdf)

    setIsLoading(true)
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/s3bucket/reports`
    const data = {
      pdf_data_url: base64PDF,
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

      console.log("CLIENT INFO BEFORE UPLOADING REPORT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", clientInfo);

      //Fourth, Upload the Report Information to the DB
      const report_info = await handleUploadReport(clientInfo.Client_ID, result.uploaded_url);

      console.log("REPORT INFO $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", report_info);

      //Fifth, UploadImages to the DB
      await handleUploadImages(report_info.Report_ID)

      setIsSaved(true);

      setIsLoading(false)
      return result;
    } catch (error) {
      console.error('There was an error uploading the pdf in the S3:', error);
      setIsLoading(true)
    }
  }
  //Save the signature in the S3
  const handleUploadSignature = async (signature) => {
    setIsLoading(true)
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
      setIsLoading(false)
      return result;
    } catch (error) {
      console.error('There was an error uploading the signature:', error);
      setIsLoading(false)
    }    
  }

  const handleUpdateSignature = async (oldSignature, newSignature) => {
    setIsLoading(true)
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
      setIsLoading(false)
    } catch{
      console.error('There was an error updating the signature:', error);
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    setIsLoading(true)
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
      setIsLoading(false)
      // alert('Profile updated successfully!');
    } catch (error) {
      console.error('There was an error updating the profile:', error);
      setIsLoading(false)
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

  const generatePDFBlob = async (pdfDoc) => {
    return new Promise((resolve, reject) => {
      <BlobProvider document={pdfDoc}>
        {({ blob, url, loading, error }) => {
          if (loading) {
            // Handle loading state
            return <div>Loading...</div>;
          }
          if (error) {
            // Handle error state
            reject(error);
            return <div>Error: {error.message}</div>;
          }
          setPdfBlob(blob);
          // Resolve with the generated PDF blob
          resolve(Promise.resolve(blob));
          return Promise.resolve(blob); // Return null to avoid React warnings
        }}
      </BlobProvider>
    });
  };

  const getPDFBase64 = async () => {
    console.log("DATA IMAGES PDF", data.images);

    //const dataToPdf = await updateData(data);

    const dataToPdf = await replaceS3UrlsWithBlobs(data.images);

    console.log("DATA IMAGES AFTER DOWNLOAD FROM S3 ===========================================:", dataToPdf);
    console.log("URL BEFORE ADDING TO PDF =============================================================:", url);

    // console.log("DATA IMAGES PDF", data.images);
    const pdfDoc = (
      <reportGenerationContext.Provider value={{ data, setValues: setData }}>
        <PDFDocument signature={url} isSigned={isSigned} />
      </reportGenerationContext.Provider>
    );

    // const renderStream = await renderToStream(<reportGenerationContext.Provider value={{ data, setValues: setData }}>
    //   <PDFDocument signature={url} isSigned={isSigned} />
    // </reportGenerationContext.Provider>);

    // console.log("RENDER TO STREAM RESULT *********************************************", renderStream);

      // // Convert JSX structure to HTML string
      // const htmlString = renderToStaticMarkup(pdfDoc);

      // // Create a Blob from the HTML string
      // const blobFiles = new Blob([htmlString], { type: 'text/html' });

    // Render the PDFDocument component to a static HTML markup
    //   const pdfMarkup = `
    //   <html>
    //     <body>
    //       <div id="pdf-content">
    //         <!-- Your PDF content here -->
    //         <reportGenerationContext.Provider value={{ data, setValues: setData }}>
    //           <PDFDocument signature={url} isSigned={isSigned} dataToPdfImages={dataToPdf}/>
    //         </reportGenerationContext.Provider>
    //       </div>
    //     </body>
    //   </html>
    // `;

    //pdfDoc.props.value.data.images['pipe1'][0].url = "blob:http://localhost:3000/7b754573-6765-43e9-9335-9440e7f4fa7d";

    console.log("pdfDoc ?????????????????????????????????????????????????", pdfDoc);
  
    //const blobFiles = await pdf(pdfDoc).toBlob();

    // const pdf = new jsPDF('p', 'pt', 'a4');

    //     // Use a Promise to handle the asynchronous PDF generation
    //   return new Promise((resolve, reject) => {
    //     // Add HTML content to PDF using jsPDF's html method
    //     pdf.html(htmlString, {
    //       callback: async (doc) => {
    //         // Generate Blob instead of saving PDF
    //         const pdfBlob = doc.output('blob');

    //         const urlBlob = URL.createObjectURL(pdfBlob);

    //         console.log("TO PDF BLOB {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{", urlBlob);
    //         const pdfBase64 = await convertBlobToBase64(pdfBlob);
    //         // Resolve the Promise with the generated PDF Blob
    //         resolve(pdfBase64);
    //       },
    //       margin: [10, 10, 10, 10],
    //       autoPaging: 'text',
    //       x: 0,
    //       y: 0,
    //       width: 190, // target width in the PDF document
    //       windowWidth: 675 // window width in CSS pixels
    //     });
    //   });

    //await pdf.html(pdfDoc);

    //const blobFiles = pdf.output('blob');

    //const blobFiles = await generatePDFBlob(pdfDoc);
  
    console.log("PDF RENDER$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$:",  pdfDoc);
    const blobFiles = await pdf(pdfDoc).toBlob();

    console.log("BLOB FILES AFTER BLOB PROVIDER %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", blobFiles);

    const urlBlob = URL.createObjectURL(blobFiles);

    console.log("TO PDF BLOB {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{", urlBlob);
    const pdfBase64 = await convertBlobToBase64(blobFiles);
  
    return pdfBase64;
  };


  const handleGenerate = async () => {
    //const blobFiles = await pdf(MyDoc).toBlob();
    // console.log("entering in handleGenerate")
    // console.log(signatureCanvasRef.current)
    // console.log(!signatureCanvasRef.current.isEmpty())
    // console.log(personalInfo.signature === null)
    // console.log(!isSigned)
    const blobFiles = await pdf(MyDoc).toBlob();
    console.log("Genrating PDF Blob", MyDoc);
    console.log("Genrating PDF Blob", blobFiles);
    console.log("entering in handleGenerate")
    if (signatureCanvasRef.current && !signatureCanvasRef.current.isEmpty() && personalInfo.signature === null && !isSigned) {
      setUrl(signatureCanvasRef.current.getTrimmedCanvas().toDataURL('image/png'));
      setIsLoading(true);
      setIsSigned(true);
      await handleUploadSignature(signatureCanvasRef.current.getTrimmedCanvas().toDataURL(`${personalInfo.userId}/${personalInfo.firstName}/${personalInfo.lastName}/signature/png`));
       // First, Upload the Address of the Client to the DB
    const address_info = await handleUploadAddress();

    // //Second, Upload the client Information to the DB
    const client_info = await handleUploadClient(address_info.Address_ID)

    setClientInfo(client_info);

    //Third, upload the pdf to S3
    // const pdfBase64 = await getPDFBase64();
    // const pdf_url = await handleUploadPDF(pdfBase64);

    //Fourth, Upload the Report Information to the DB
    // const report_info = await handleUploadReport(client_info.Client_ID)

    //Fifth, UploadImages to the DB
    // await handleUploadImages(report_info.Report_ID)

      
      await handleUpdate()
      await fetchData();
      // console.log("everything posted");
      
    } else 
    // console.log("isEdit && signatureCanvasRef.current && !signatureCanvasRef.current.isEmpty() && !isSigned",isEdit && signatureCanvasRef.current && !signatureCanvasRef.current.isEmpty() && !isSigned)
    // console.log("isEdit",isEdit)
    // console.log("!isSigned",!isSigned)
    // console.log("signatureCanvasRef",signatureCanvasRef)
    if(isEdit && signatureCanvasRef.current && !signatureCanvasRef.current.isEmpty() && !isSigned){
      console.log("Entering in the edit signature handle generate")
      setIsLoading(true);
      setIsSigned(true);
      // console.log("URL", personalInfo.toString(personalInfo.signature))
    const parts = personalInfo.signature.split('/')
    const bucket_name = parts[2].split('.')[0]
    const objectKey = parts.slice(3).join('/');
    // console.log("parsing url", parts, bucket_name, objectKey);
    // console.log("signature uploaded from handle generate", signatureCanvasRef.current.getTrimmedCanvas().toDataURL(`${personalInfo.userId}/${personalInfo.firstName}/${personalInfo.lastName}/signature/png`))
    await handleUpdateSignature(objectKey, signatureCanvasRef.current.getTrimmedCanvas().toDataURL(`${personalInfo.userId}/${personalInfo.firstName}/${personalInfo.lastName}/signature/png`));
    await handleUpdate();
    
    // First, Upload the Address of the Client to the DB
    const address_info = await handleUploadAddress();
    
    // //Second, Upload the client Information to the DB
    const client_info = await handleUploadClient(address_info.Address_ID)

    setClientInfo(client_info);
    
    //Third, upload the pdf to S3
    //const pdfBase64 = await getPDFBase64();
    //const pdf_url = await handleUploadPDF(pdfBase64);
    
    //Fourth, Upload the Report Information to the DB
    // const report_info = await handleUploadReport(client_info.Client_ID)
    
    //Fifth, UploadImages to the DB
    // await handleUploadImages(report_info.Report_ID)
    await fetchData();

  } else 
  if(personalInfo.signature && !isSigned && !isEdit){
    console.log("Entering in the get signature handle generate")
    setIsLoading(true);
    // console.log("pdfBlob",pdfBlob)
    // console.log("BASE64 INSIDE handleGenerate", base64)
    // setIsLoading(true)
    setIsSigned(true);
    // First, Upload the Address of the Client to the DB
    const address_info = await handleUploadAddress();

    // //Second, Upload the client Information to the DB
    const client_info = await handleUploadClient(address_info.Address_ID)

    setClientInfo(client_info);

    //Third, upload the pdf to S3
    // const pdfBase64 = await getPDFBase64();
    // const pdf_url = await handleUploadPDF(pdfBase64);

    // //Fourth, Upload the Report Information to the DB
    // const report_info = await handleUploadReport(client_info.Client_ID)

    // //Fifth, UploadImages to the DB
    // await handleUploadImages(report_info.Report_ID)
    
    // console.log("BlobFiles before convertBlobtoBase64")
    // console.log("BLOBFILES before convertToPDF",blobFiles)
    //const pdfBase64 = await convertBlobToBase64(blobFiles);
    // console.log("pdfBase64 variable",pdfBase64)
    // console.log("BASE64BLOB", base64Blob);
    // console.log({pdf_url});

    console.log("Document Signed")
  }
  // console.log("personalInfo.signature",personalInfo.signature)
  console.log("!isSigned", !isSigned)
  setEnableGenerate(false);
  }

  // useEffect(() => {

  //   if(pdfBlob){
  //     console.log("Entering in first useEffect")
  //     console.log(pdfBlob)
  //     convertBlobToBase64(pdfBlob)
  //     // setBlob(null)
  //   }
  // }, [pdfBlob])

  // useEffect(() => {
  //   if(base64){
  //     handleGenerate();
  //     // setBase64(null);
  //   }
  // }, [base64])

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
    // console.log("handleUrl", url);
  }

  const handlePopupModal = () => {

    setModal(!modal);
    // console.log("modal value", modal);
  }

  const handlePopupIsSignedMessage = () => {

    setIsSignedMessage(!isSignedMessage);
    // console.log("modal value", isSignedMessage);
  }

  const handleNavigate = () => {
    navigate("/editreport-ts", { state: { isAdmin } });
  }

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
    // console.log("Blob before generating", blob)

    const blobThing = blob;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      resolve(result);
      // setBase64(reader.result);
      // setValues({...data, pdfBase64: reader.result})
      console.log("Document converted",base64)
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(blobThing);
  
  });
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

  // console.log("Context Data", data);
  // console.log("Personal Info", personalInfo);
  // console.log("!isSigned", !isSigned)

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
            {isSigned /*&& !isSaved*/ ? (
              //   <PDFDownloadLink document={<reportGenerationContext.Provider value={{ data, setValues: setData }}>
              //     <PDFDocument signature={url} />
              //   </reportGenerationContext.Provider>} fileName="report.pdf" className="justify-center text-center p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700">
              //     {({ blob, url, loading, error }) => 
              //       loading ? 'Loading document...' : 'Export to pdf'

              // }
              //   </PDFDownloadLink>

              <BlobProvider document={MyDoc}>
                {({ blob, url, loading, error }) => {
                  console.log("BLOB URL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", url);
                  if (loading) {
                    return <div>Loading document...</div>;
                  }
                  if (error) {
                    return <div>Error generating document: {error.message}</div>;
                  } 
                  if (blob && !pdfBlob) {  // Check if base64 is not already set
                    // console.log("blob && !base64",blob && !base64)
                    console.log("BLOB inside blobprovider", blob)
                    // console.log("BASE64", !base64)
                    // setPdfBlob(blob)
                    //handleUploadPDF(url);
                    
                  }
                  return (
                    // <div className="flex">
                    <>
                      {/* <div className="mb-4"> */}
                        <a
                          href={url}
                          download="report.pdf"
                          className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] text-center bg-indigo-700 hover:bg-blue-400 text-white-A700"
                          >
                          Export to PDF
                        </a>
                      {!isSaved && (
                        <button
                        className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => {
                          setShowConfirmation(true);
                        }}
                        >
                          Submit
                        </button>
                      )}
                      {/* </div> */}
                      {showConfirmation && (
                        <div className="bg-white-A700 border-2 max-w-[500px] max-h-[200px] fixed inset-0 flex flex-col items-center justify-center z-50 p-5 rounded-lg shadow-lg text-center text-black m-auto">
                          {/* <div className="bg-white p-5 rounded-lg shadow-lg">
                            <div className="text-center text-black"> */}
                            {/* <div className="border"> */}

                              <p>Are you sure you want to submit?</p>
                            {/* </div> */}
                              <div className="mt-4 flex justify-center">
                                <button
                                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400 mr-2"
                                  onClick={async () => {
                                    handleConfirmSubmission(blob);
                                  }}
                                  >
                                  Confirm
                                </button>
                                <button
                                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400 ml-2"
                                  onClick={() => setShowConfirmation(false)}
                                  >
                                  Cancel
                                </button>
                              </div>
                            {/* </div>
                          </div> */}
                        </div>
                      )}
                    {/* </div> */}
                      </>
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
                setIsEdit(false);
                setModal(false);
              } catch (error) {
                console.error('Error generating:', error);
              }
            }
          }
              setEnableGenerate={()=>setEnableGenerate(true)}
              handleCallGenerate={()=>{setCallGenerate(true)}}
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