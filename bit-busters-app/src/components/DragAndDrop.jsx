import "../CSS/DragAndDrop.css";
import React, { useState, useRef, useEffect} from "react";


export const DragAndDrop = (props) => {
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const [totalImagesAdded, setTotalImagesAdded] = useState(0);
    
    useEffect(() => {
        console.log("Images: ", images);
    }, [images]);

    useEffect(() => {
        console.log("TOTAL IMAGES ADDED AFTER DROP", totalImagesAdded);
    }, [totalImagesAdded]);

    function selectFiles() {
        fileInputRef.current.click();
    }

    function clearFileInput() {
        fileInputRef.current.value = null;
    }

    function onFileSelect(event) {
        if(totalImagesAdded < 5){
            const files = event.target.files;
            console.log("Files on Event", event.target.files);
            if (files.length === 0) return;

            const processedImages = []; // Store processed images

            let localImageCount = totalImagesAdded;

            let newImagesAdded = false; // Flag to track if new images were added

            for (let i = 0; i < files.length; i++) {
                if (files[i].type.split("/")[0] !== "image") continue;
                console.log("Images before checking duplicates:", images);
                if (!images.some((e) => e.name === files[i].name) && localImageCount < 5) {
                    setImages((previmages) => [...previmages, {
                        name: files[i].name,
                        url: URL.createObjectURL(files[i]),
                    },]);
                    const imageUrl = URL.createObjectURL(files[i]);
                    processedImages.push({ name: files[i].name, url: imageUrl });
                    localImageCount = localImageCount + 1;
                    newImagesAdded = true; // Set the flag to true if a new image is added
                }    
            }
            
            if(newImagesAdded){
                console.log("local count before adding", localImageCount);
                if(totalImagesAdded + localImageCount > 5 && localImageCount !== totalImagesAdded + 1){
                    setTotalImagesAdded(5);
                }
                else{
                    setTotalImagesAdded(prevValue => prevValue + localImageCount);
                    localImageCount = localImageCount - totalImagesAdded;
                    console.log("local count after substracting", localImageCount);
                }
            }
            props.addToImageList({ images: processedImages, pipeIndex: props.pipeIndex });
        }
        else{
            event.target.value = null; // Clear the input field
            console.log("Files on event after clear", event.target.files);
            console.log("TOTAL IMAGES", totalImagesAdded);
            return;
        }
    }

    function deleteImage(index){
        setImages((prevImages) => {
            const updatedImages = prevImages.filter((_, i) => i !== index);
            props.deleteFromImageList({ images: updatedImages, pipeIndex: props.pipeIndex });
            setTotalImagesAdded(prevValue => prevValue - 1);
            clearFileInput() //To be able to add the picture you erased again
            return updatedImages;
        });
    }
      

    function onDragOver(event){
        event.preventDefault();
        setIsDragging(true);
        event.dataTransfer.dropEffect = "copy"
    }

    function onDragLeave(event){
        event.preventDefault();
        setIsDragging(false);
    }

    function onDrop(event){
        event.preventDefault();
        setIsDragging(false);
        if(totalImagesAdded < 5){
            const files = event.dataTransfer.files;

            let localImageCount = totalImagesAdded;

            let newImagesAdded = false; // Flag to track if new images were added

            const processedImages = [];

            console.log("FILES LENGTH IN DROP", files.length);

            for (let i = 0; i < files.length; i++) {
                if (files[i].type.split("/")[0] !== "image") continue;
                if (!images.some((e) => e.name === files[i].name) && localImageCount < 5) {
                    setImages((previmages) => [...previmages, {
                        name: files[i].name,
                        url: URL.createObjectURL(files[i]),
                    },]);
                    const imageUrl = URL.createObjectURL(files[i]);
                    processedImages.push({ name: files[i].name, url: imageUrl });
                    localImageCount = localImageCount + 1;
                    newImagesAdded = true; // Set the flag to true if a new image is added
                }
            }
            
            console.log("local count before adding", localImageCount);

            if(newImagesAdded){
                if(totalImagesAdded + localImageCount > 5 && localImageCount !== totalImagesAdded + 1){
                    setTotalImagesAdded(5);
                }
                else{
                    setTotalImagesAdded(prevValue => prevValue + localImageCount);
                    localImageCount = localImageCount - totalImagesAdded;
                    console.log("local count after substracting", localImageCount);
                }
            }
            props.addToImageList({ images: processedImages, pipeIndex: props.pipeIndex });
        }
        else{
            event.target.value = null; // Clear the input field
            console.log("Files on event after clear", event.target.files);
            console.log("TOTAL IMAGES", totalImagesAdded);
            return;
        }
    }
    
        return (
            <div className="card">
                <div className="text-center">
                    <p> Pipe #{props.pipeNumbers}</p>

                </div>
                <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} >
                    {isDragging ? (
                        <span className="select">
                            Drop images Here
                        </span>) : (
                        <>
                            Drag and Drop images here or {" "}
                            <span className="select" role="button" onClick={
                                selectFiles}>
                                Browse
                            </span>
                        </>
                    )}

                    <input name="file" type="file" multiple ref={fileInputRef} onChange={onFileSelect} ></input>
                </div>

                <div className="text-center">

                <p style={{ color: 'red', padding: '8px', borderRadius: '5px' }}>
                    Limit: 5 images per pipe
                </p>

                </div>

                <div className="container">
                    {props.images.map((images, index) => (
                            <div className="image" key={index}>
                                <span className="delete" onClick={() => (!props.enableButton ? null :( deleteImage(index)))} >&times;</span>
                                 {/* onClick={() => (!props.enableButton ? null : (handleIndex(i), setModal(!modal)))} */}
                                <img src={images.url} alt={images.name} />
                            </div>
                        ))}
                </div>
            </div>
        );
    }