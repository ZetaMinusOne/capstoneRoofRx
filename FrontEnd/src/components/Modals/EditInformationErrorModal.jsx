import "../../CSS/Modal.css"


export default function Modal({toggleModal, accountName}) {

  return (
    <>
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
          
            <h1 className='mb-4'>Error updating your perosnal information </h1> 
            
            <p className='mb-8'>
              Personal Information could not be updated due to errors in input(s). Please verify your input(s) information
            </p>
            <button  className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400 float-right" onClick={toggleModal}>
              close
            </button>
          </div>
        </div>
    </>
  );
}