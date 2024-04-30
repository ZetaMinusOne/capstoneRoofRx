import "../../CSS/Modal.css"
import SignatureCanvas from "react-signature-canvas"
import React from "react";


export default function SignatureModal({ toggleModal, signatureCanvasRef, handleClear, handleGenerate, url, handleUrl }) {
 
    return (
        <>
            <div className="modal">
                <div onClick={toggleModal} className="overlay"></div>
                <div className="modal-content">
                    <h1 className='mb-4'>Create your Signature</h1>
                    <div className="border-2 m-auto">

                        {url === undefined ? (
                            <SignatureCanvas
                                penColor="black"
                                canvasProps={{ width: 500, height: 300, className: 'sigCanvas' }}
                                ref={signatureCanvasRef}
                            />
                        ) : (
                            <img src={url} alt="signature" style={{ width: "500px", height: "300px" }} />
                        )}
                    </div >

                    <p className='mb-8'>
                        Add or edit your signature
                    </p>


                    <div className="flex justify-start">
                        <button className="border border-gray-500 bg-zinc-300  mr-auto w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={handleGenerate}>
                            Sign
                        </button>
                        {url === undefined && (
                            <button className="border border-gray-500 bg-zinc-300  mr-auto w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={handleClear}>
                                Clear
                            </button>
                        )}
                        <button className="border border-gray-500 bg-zinc-300  mr-auto w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={handleUrl}>
                            Edit
                        </button>
                        
                        <button className="border border-gray-500 bg-zinc-300  mr-auto w-[100px] rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={toggleModal}>
                            Close
                        </button>
                        
                    </div>

                </div>
            </div>
        </>
    );
}