import "../CSS/DragAndDrop.css";
import React, { useState, useRef, useEffect} from "react";


export const DragAndDrop = (props) => {
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        console.log("Images: ", images);
    }, [images]);

    function selectFiles() {
        fileInputRef.current.click();
    }

    function onFileSelect(event) {
        const files = event.target.files;
        if (files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split("/")[0] !== "image") continue;
            if (!images.some((e) => e.name === files[i].name)) {
                setImages((previmages) => [...previmages, {
                    name: files[i].name,
                    url: URL.createObjectURL(files[i]),
                },]);
            }
        }
        props.updateList(props.pipeIndex, images)
    }

    function deleteImage(index){
        setImages((prevImages) =>
            prevImages.filter((_,i) => i !== index)
        );
        props.updateList(props.pipeIndex, images)
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
        const files = event.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split("/")[0] !== "image") continue;
            if (!images.some((e) => e.name === files[i].name)) {
                setImages((previmages) => [...previmages, {
                    name: files[i].name,
                    url: URL.createObjectURL(files[i]),
                },]);
            }
        }
        props.updateList(props.pipeIndex, images)
    }

    function uploadImage(){
        console.log("Images: ", images);
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
                <div className="container">
                    {images.map((images, index) => (
                            <div className="image" key={index}>
                                <span className="delete" onClick={() => deleteImage(index)} >&times;</span>
                                <img src={images.url} alt={images.name} />
                            </div>
                        ))}
                </div>
                {/* <button type="button" onClick={uploadImage} >
                    upload
                </button> */}
            </div>
        );
    }