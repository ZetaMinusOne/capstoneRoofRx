import React, { useState, useEffect } from "react"
import { DragAndDrop } from "./DragAndDrop"
import DeletingPipeModal from "../components/Modals/DeletingPipeModal"
export default function DynamicInput(props) {

    const [count, setCount] = useState(1);
    const [value, setValue] = useState([]);
    const [pipeNumbers, setPipeNumbers] = useState([]);
    const [dragAndDropImages, setDragAndDropImages] = useState([]);
    const [modal, setModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null); // State to store the index of the pipe to delete
    
    useEffect(() => {
        console.log("VALUES: ", value);
    }, [value]);

    useEffect(() => {
        console.log("images from Dynamic Input", dragAndDropImages);
    }, [dragAndDropImages]);

    useEffect(() => {
        props.handleDragAndDropImagesParent(dragAndDropImages);
    }, [dragAndDropImages]);

    const handleAdd = () => {
        setValue([...value, []]);
        setPipeNumbers([...pipeNumbers, count]);
        setDragAndDropImages([...dragAndDropImages, []]); // Add an empty array for the new drag and drop component
        setCount(count + 1);
    }

    const handleIndex =(i) =>{
        setDeleteIndex(i)
    }

    const handleDelete = (i) => {
        const deleteValue = [...value];
        const updatedPipeNumbers = [...pipeNumbers];
        const updatedDragAndDropImages = [...dragAndDropImages];

        deleteValue.splice(i, 1);
        updatedPipeNumbers.splice(i, 1);
        updatedDragAndDropImages.splice(i, 1); // Remove the deleted drag and drop component

        const reindexedPipeNumbers = updatedPipeNumbers.map((number, index) => index + 1);

        setValue(deleteValue);
        setPipeNumbers(reindexedPipeNumbers);
        setCount(count - 1);
        setDragAndDropImages(updatedDragAndDropImages);

        console.log("deleted from dragAndDropImages in handleDelete:", i); 
    }


    const addToImageList = (newImageList) => {
        setDragAndDropImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[newImageList.pipeIndex] = [...prevImages[newImageList.pipeIndex] || [], ...newImageList.images]; // Concatenate existing and new images
          console.log("added dragAndDropImages:", updatedImages); 
          return updatedImages;
        });
      };

    const deleteFromImageList = (newImageList) => {
        setDragAndDropImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages[newImageList.pipeIndex] = newImageList.images;
            console.log("deleted from dragAndDropImages in deleteFromImageList:", updatedImages); 
            return updatedImages;
        });
    }

    

    console.log("images from Dynamic Input", dragAndDropImages);
    return (
        <>

            {dragAndDropImages.map((data, i) => {
                console.log("Data mapped",data)
                return (
                    <div key={i}>
                        <DragAndDrop pipeIndex={i} pipeNumbers={pipeNumbers[i]} addToImageList = {addToImageList} deleteFromImageList = {deleteFromImageList} images ={dragAndDropImages[i]}/>
                        <button className=" text-white-A700 bg-red-600 hover:bg-red-400 w-[150px] border rounded-3xl justify-center p-2" 
                        // onClick={() => { handleDelete(i)}}>
                        onClick={() => {handleIndex(i); setModal(!modal)}}> 
                            {`Delete Pipe #${pipeNumbers[i]}`}</button>
                    </div>
                )
            })}
            <span className="m-auto">
                <button className=" text-white-A700 bg-lime-600 hover:bg-lime-400 w-[150px] border rounded-3xl justify-center p-2" onClick={() => {
                    handleAdd()
                }}>{`Add Pipe #${count}`}</button>
            </span>
            {modal && <DeletingPipeModal toggleModal={() => setModal(!modal)} pipeindex={deleteIndex} handleDelete = { () => handleDelete(deleteIndex)} />}
        </>
    );
}




