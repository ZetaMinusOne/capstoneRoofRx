import React, { useState, useRef, } from "react";
import { Helmet } from "react-helmet";
import Sidebar1 from "../components/SideBar";
import DropdownMenu from "components/DropDown";
import PDFDocument from "../components/pdfDocumentView"
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import Modal from "../components/Modals/SignatureModal"
import { useContext } from "react";
import { reportGenerationContext } from "../components/Context";
import setData from "Routes"

export default function ReportGeneratedPage() {

  const [signature, setSignature] = useState();

  const [url, setUrl] = useState();

  const signatureCanvasRef = useRef(null);

  const[modal, setModal] = useState(false);

  // const handleSaveSignature = (signatureRef) => {
  //   setSignature(signatureRef?.toDataURL());
  // };

  const handleClear = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear(); // Access the clear method through the ref
    }
    console.log(signatureCanvasRef)
  };

  const handleGenerate=()=>{
      setUrl(signatureCanvasRef.current.getTrimmedCanvas().toDataURL('image/png'));
      console.log(url);
  }

  const handleUrl=()=>{
    setUrl(undefined);
    console.log("handleUrl", url);
  }

  const handlePopupModal = () => {
    setModal(!modal);
    console.log("modal value", modal);
  }
  console.log("url: ", url);
  const { data, setValues } = useContext(reportGenerationContext);
  console.log("context data", data);
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

        <Sidebar1 className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />

        <div className="flex flex-col justify-center gap-7 ml-auto mr-auto w-full h-full mt-[70px]">

          <div className="h-[800px]">
            <PDFViewer className="w-[80%] h-full m-auto border" showToolbar={false}>
            <reportGenerationContext.Provider value={{ data, setValues: setData }}>
            <PDFDocument signature={url} />
            </reportGenerationContext.Provider>
            </PDFViewer>
          </div>

          <div className="flex justify-between w-full mt-[20px] border max-w-[750px] m-auto mb-[50px]">

            <button className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700">
              Edit Report
            </button>

            <button className="p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-gray-500 hover:bg-gray-400 text-white-A700" onClick={handlePopupModal}>
              Sign Document
            </button>

            <PDFDownloadLink document={<reportGenerationContext.Provider value={{ data, setValues: setData }}>
            <PDFDocument signature={url} />
            </reportGenerationContext.Provider>} fileName="report.pdf" className="justify-center text-center p-2 sm:px-5 font-dmsans font-bold min-w-[160px] rounded-[24px] bg-indigo-700 hover:bg-blue-400 text-white-A700">
              {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : 'Export to pdf'
              }
            </PDFDownloadLink>
          </div>
          <div>

          { modal && <Modal signatureCanvasRef = {signatureCanvasRef} url={url} toggleModal={() => setModal(!modal)} handleClear={handleClear} handleGenerate={handleGenerate} handleUrl={handleUrl}/>}
          </div>
        </div>
      </div>
    </>
  );
}