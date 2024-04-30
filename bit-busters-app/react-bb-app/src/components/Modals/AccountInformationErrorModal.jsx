// Modal.js
import "../../CSS/Modal.css"


export default function Modal({ toggleModal, errorModal, toggleConfirmChanges, confirmChanges, handleUpdateProfile }) {
  return (
    <>
    {!confirmChanges && 
    <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content ">

            <h1 className='mb-4'>Updating your information </h1>

            <p className='mb-8'>
              Are you sure you want to update your information?
            </p>
            <div className="flex">
            <button className="border m-auto border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={()=>{toggleConfirmChanges(); }}>
              confirm
            </button>
            <button className="border m-auto border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={toggleModal}>
              close
            </button>
            </div>
          </div>
        </div>
      }
      {(errorModal && confirmChanges) ? (
        <div className="modal">
          <div onClick={() => {toggleModal(); toggleConfirmChanges(); }} className="overlay"></div>
          <div className="modal-content">

            <h1 className='mb-4'>Error updating your perosnal information </h1>

            <p className='mb-8'>
              Personal Information could not be updated due to errors in input(s). Please verify your input(s) information
            </p>
            <button className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={() => {toggleModal(); toggleConfirmChanges(); }}>
              close
            </button>
          </div>
        </div>
      ):((!errorModal && confirmChanges) &&
        <div className="modal">
          <div onClick={() => {toggleModal(); toggleConfirmChanges(); handleUpdateProfile();}} className="overlay"></div>
          <div className="modal-content">

            <h1 className='mb-4'>Information Updated </h1>

            <p className='mb-8'>
              Your information has been updated successfully
            </p>
            <button className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={() => {toggleModal(); toggleConfirmChanges(); handleUpdateProfile();}}>
              close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

