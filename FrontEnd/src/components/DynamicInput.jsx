import React, { useState, useEffect } from "react"
import { DragAndDrop } from "./DragAndDrop"
import { Button } from "../components";

export default function DynamicInput() {

    const [count, setCount] = useState(2);
    const [value, setValue] = useState([]);
    const [pipeNumbers, setPipeNumbers] = useState([]);

    useEffect(() => {
        console.log("VALUES: ", value);
    }, [value]);

    const handleAdd = () => {
        setValue([...value, []]);
        setPipeNumbers([...pipeNumbers, count]);
        setCount(count + 1);
    }

    const handleDelete = (i) => {
        const deleteValue = [...value];
        const updatedPipeNumbers = [...pipeNumbers];
        deleteValue.splice(i, 1);
        updatedPipeNumbers.splice(i, 1);
        setValue(deleteValue);
        setPipeNumbers(updatedPipeNumbers);
        setCount(count - 1);
    }


    function updateList(i, newList) {
        console.log("Updating list of images inside the parent component")
    }

    return (
        // I need to implement a list that contains list of each DragAndDrop to send them separately to the ML 
        <>

            <DragAndDrop pipeNumbers={1} updateList={updateList} />
            {value.map((data, i) => {
                return (
                    <div key={i}>
                        <DragAndDrop value={data} pipeIndex={count - 2} pipeNumbers={pipeNumbers[i]} updateList={updateList} />
                        {/* {console.log(value)} */}
                    </div>
                )
            })}
            <span className="m-auto">
            <button className=" text-white-A700 bg-lime-600 hover:bg-lime-400 w-[150px] border rounded-3xl justify-center p-2" onClick={() => {
                handleAdd()
            }}>{`Add Pipe #${count}`}</button>

            {count > 2 && <button className=" text-white-A700 bg-red-600 hover:bg-red-400 w-[150px] border rounded-3xl justify-center p-2" onClick={() => {
                handleDelete(value.length - 1)
            }}>{`Delete Pipe #${count - 1}`}</button>}
            </span>
            
        </>
    );
}