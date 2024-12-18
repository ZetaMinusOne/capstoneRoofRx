import "../CSS/Modal.css"


export default function Modal({toggleModal, accountName}) {

  return (
    <>
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h1 className='mb-4'>Deleting {accountName} account</h1>
            <p className='mb-8'>
              Are you sure you want to delete {accountName} account?
            </p>
            <button  className=" text-white-A700 border border-gray-500 bg-red-600  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-red-800" onClick={toggleModal}>
              Delete
            </button>
            <button  className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={toggleModal}>
              Cancel
            </button>
          </div>
        </div>
    </>
  );
}