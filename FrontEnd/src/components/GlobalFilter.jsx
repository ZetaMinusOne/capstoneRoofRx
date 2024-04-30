import React from 'react';


export const GlobalFilter =({filter, setFilter, inspectorName}) =>{
    return (
        <span>
            <input 
            value={filter || ''} 
            onChange={e => setFilter(e.target.value)} 
            placeholder= { 'Search... ' } 
            className='flex flex-col items-start w-full min-w-[250px] gap-7 mt-20 pt-2 pb-2 pl-2 rounded border border-slate-300  hover:border-sky-500'
            />
        
        </span>
    );
}

export default GlobalFilter;