import { createContext, useContext,  } from 'react';

export const reportGenerationContext = createContext("");

export function useReportGenerationContext(){
    const {data, } = useContext(reportGenerationContext);

    if (data === undefined){
        throw new Error("useReportGenerationContext must be used with reportGeneartionContext");
    }

    return data;
}