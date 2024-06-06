import "../../CSS/Modal.css"
import SignatureCanvas from "react-signature-canvas"
import React from "react";


export default function SignatureModal({ toggleModal, signatureCanvasRef, handleClear, url, handleUrl, isSigned, handleIsEdit, isEdit, handleCallGenerate, handleGenerate, setEnableGenerate  }) {

    return (
        <>
            <div className="modal">
                <div onClick={() => {toggleModal(); handleIsEdit();}} className="overlay"></div>
                <div className="modal-content">
                    <h1 className='mb-4'>Create your Signature</h1>
                    <div className="border-2 m-auto">

                        {url === null || isEdit ? (
                            <SignatureCanvas
                                penColor="black"
                                canvasProps={{ width: 500, height: 300, className: 'sigCanvas' }}
                                ref={signatureCanvasRef}
                            />
                        ) : (
                            <img src={url} alt="signature" style={{ width: "500px", height: "300px" }} />
                        )}
                    </div >

                    {isSigned ? 
                    <p className='mb-8'>
                        Document is Signed
                    </p>
                    :
                    <p className='mb-8'>
                        Add or edit your signature
                    </p>
                    }


                    <div className="flex justify-end w-full m-auto">
                        {!isSigned && (
                            <button className="border m-auto border-gray-500 bg-zinc-300 w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={() => { handleGenerate(); handleCallGenerate(); setEnableGenerate(); }}>
                                Sign
                            </button>
                        )}
                        {(url === null || isEdit) && (
                            <button className="border m-auto border-gray-500 bg-zinc-300 w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={handleClear}>
                                Clear
                            </button>
                        )}

                        {(!isSigned && !isEdit ) && (
                            <button className="border m-auto border-gray-500 bg-zinc-300 w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={handleUrl}>
                                Edit
                            </button>
                        )}
                        {isEdit ? (
                            <button className="border m-auto border-gray-500 bg-zinc-300 w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={() => {handleIsEdit(); }}>
                                Cancel
                            </button>

                        ) : (
                            <button className="border m-auto border-gray-500 bg-zinc-300 w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={() => { toggleModal(); handleIsEdit(); }}>
                                Close
                            </button>
                        )
                        }

                    </div>

                </div>
            </div>
        </>
    );
}