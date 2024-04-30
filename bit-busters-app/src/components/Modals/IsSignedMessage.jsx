import "../../CSS/Modal.css"


export default function Modal({ toggleModal, isSigned }) {

  return (
    <>
      {isSigned ?

        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h1 className='mb-4'>Document is signed.</h1>
            <p className='mb-8'>
              The Document is already signed, you can't modify it.
            </p>
            <button className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={toggleModal}>
              close
            </button>
          </div>
        </div>
      :
      <div className="modal">
        <div onClick={toggleModal} className="overlay"></div>
        <div className="modal-content">
          <h1 className='mb-4'>Document is not signed.</h1>
          <p className='mb-8'>
            To download the document you must sign it first.
          </p>
          <button className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={toggleModal}>
            close
          </button>
        </div>
      </div>}
    </>
  );
}