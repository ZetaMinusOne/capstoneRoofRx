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

    function onFileSelect(event) {
        if(totalImagesAdded < 5){
            const files = event.target.files;
            console.log("Files on Event", event.target.files);
            if (files.length === 0) return;

            const processedImages = []; // Store processed images

            let localImageCount = totalImagesAdded;

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
                }    
            }

            if(totalImagesAdded + localImageCount > 5){
                setTotalImagesAdded(5);
            }
            else{
                setTotalImagesAdded(prevValue => prevValue + localImageCount);
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
                }
            }

            if(totalImagesAdded + localImageCount > 5){
                setTotalImagesAdded(5);
            }
            else{
                setTotalImagesAdded(prevValue => prevValue + localImageCount);
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
                                <span className="delete" onClick={() => deleteImage(index)} >&times;</span>
                                <img src={images.url} alt={images.name} />
                            </div>
                        ))}
                </div>
            </div>
        );
    }