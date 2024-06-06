import React, { useState, useEffect, useRef, useMemo } from "react";
import { Helmet } from "react-helmet";
import Sidebar1 from "../components/SideBar";
import DropdownMenu from "../components/DropDown";
import PDFDocument from "../components/pdfDocumentView"
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import IsSignedMessageModal from "../components/Modals/IsSignedMessage"
import Modal from "../components/Modals/SignatureModal"
import { useContext, } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { reportGenerationContext } from "../components/Context";
import setData from "../Routes"

export default function ReportGeneratedPage() {
  //   const [collapsed, setCollapsed] = React.useState(true);

  const [signature, setSignature] = useState();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;

  const [url, setUrl] = useState();

  const signatureCanvasRef = useRef(null);

  const [modal, setModal] = useState(false);

  const [formData, setFormData] = useState({}); // State to hold form data

  const navigate = useNavigate();

  const [isSigned, setIsSigned] = useState(false);

  const [isSignedMessage, setIsSignedMessage] = useState(false);

  useEffect(() => {
    // Fetch data from backend when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('backend-url'); // Replace 'backend-url' with your actual backend endpoint
      const data = await response.json();
      setFormData(data); // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleSaveSignature = (signatureRef) => {
    setSignature(signatureRef?.toDataURL());
  };

  const handleClear = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear(); // Access the clear method through the ref
    }
    console.log(signatureCanvasRef)
  };

  const handleGenerate = () => {
    if (!signatureCanvasRef.current.isEmpty()) {
      setUrl(signatureCanvasRef.current.getTrimmedCanvas().toDataURL('image/png'));
      console.log(url);
      setIsSigned(true);
    }
  }

  const handleUrl = () => {
    setUrl(undefined);
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
    navigate("/editreport");
  }
  console.log("url: ", url);
  const { data, setValues } = useContext(reportGenerationContext);
  console.log("context data", data);
  console.log("is Signed Message", isSignedMessage);
  return (

    <>
      {/* {console.log("data from report generated: ", formData)} */}
      <Helmet>
        <title>View Report</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>

      <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">

        <div className="flex justify-end w-full items-start gap-[2px] absolute top-0 rigth-0">
          <DropdownMenu />
        </div>

        <Sidebar1 isAdmin={isAdmin} className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />

        <div className="flex flex-col justify-center gap-7 ml-auto mr-auto w-full h-full mt-[70px]">

          <div className="h-[800px]">
            <PDFViewer className="w-[80%] h-full m-auto border" showToolbar={false}>
              <reportGenerationContext.Provider value={{ data, setValues: setData }}>
                <PDFDocument signature={url} />
              </reportGenerationContext.Provider>
            </PDFViewer>
          </div>

          <div className="flex justify-between w-full mt-[20px] max-w-[750px] m-auto mb-[50px]">

            {isSigned ?
              <button className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700"onClick={() => { handlePopupIsSignedMessage(); }}>
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
              <PDFDownloadLink document={<reportGenerationContext.Provider value={{ data, setValues: setData }}>
                <PDFDocument signature={url} />
              </reportGenerationContext.Provider>} fileName="report.pdf" className="justify-center text-center p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700">
                {({ blob, url, loading, error }) =>
                  loading ? 'Loading document...' : 'Export to pdf'
                }
              </PDFDownloadLink>
            ) : (
              <button className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700" onClick={() => { handlePopupIsSignedMessage(); }}>
                Export to pdf
              </button>
            )}
          </div>
          <div>
            {isSignedMessage && <IsSignedMessageModal toggleModal={() => setIsSignedMessage(!isSignedMessage)} isSigned = {isSigned}/>}
            {modal && <Modal signatureCanvasRef={signatureCanvasRef} url={url} toggleModal={() => setModal(!modal)} handleClear={handleClear} handleGenerate={handleGenerate} handleUrl={handleUrl} />}

          </div>
        </div>
      </div>
    </>
  );
}