import "../../CSS/Modal.css"

export default function Modal({toggleModal, accountName}) {

  return (
    <>
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
          
            <h1 className='mb-4'>Information Updated </h1> 
            
            <p className='mb-8'>
              Your information has been updated successfully
            </p>
            <button  className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={toggleModal}>
              close
            </button>
          </div>
        </div>
    </>
  );
}