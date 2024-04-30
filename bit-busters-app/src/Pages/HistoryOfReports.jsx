// import fakeData from "../MOCK_DATA.json";
// import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { useTable, useGlobalFilter, usePagination } from "react-table";
import { GlobalFilter } from "../components/GlobalFilter"
import { Helmet } from "react-helmet";
import "../CSS/HistoryOfReports.css"
import { useLocation } from "react-router-dom"
import DropdownMenu from "../components/DropDown";
import Sidebar1 from "../components/SideBar";
import FadeLoader from "react-spinners/ClipLoader";
import { downloadData } from 'aws-amplify/storage';

export default function HistoryOfReports() {


  // const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;
  const [items, setItems] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  
  // const [report, setReport] = useState({
  //   id:"",
  //   inspector:"",
  //   client:"",
  //   date:"",
  //   client_address:"",
  // })

  const userID = localStorage.getItem('userID')
  useEffect (() =>{
    const fetchData = async () => {
      setIsLoading(true)
      try{
        const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/users/table/${userID}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Data:", data); // See exactly what's being fetched
      setItems(data); // Set fetched data into state
      setIsLoading(false); // Set loading to false once data is loaded

      if (data.table_data && Array.isArray(data.table_data)) {
        setItems(data.table_data);  // Set the table_data array to items
      } else {
        console.error("Unexpected data structure:", data);
        setItems([]); // Fallback to an empty array if the expected data is not found
      }
          
      }catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setIsLoading(false);
    }
  }
    fetchData(); // Call the async function
  }, [userID])

  const COLUMNS = [
    {
      Header: "ID",
      accessor: "Report_ID",
    },
    {
      Header: "Client",
      Cell: ({row}) => `${row.original.Client_FirstName} ${row.original.Client_LastName}`,
    },
    {
      Header: "Date",
      accessor: "r_Date",
    },
    {
      Header: "Client Address",
      accessor: "Address",
    },
    {
      Header: "Report",
      accessor: "actions",
      Cell: ({ row }) => (
        <button onClick={() => handleButtonClick(row.original.Report_URL)} className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400">View</button>
      )
    },
  ];

  const data = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const columns = useMemo(() => COLUMNS, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    gotoPage,
    pageCount,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize },
    setGlobalFilter, // Add setGlobalFilter here
  } = useTable(
    { columns, data },
    useGlobalFilter,
    usePagination
  );
    

  const downloadPdf = async (url) =>{
    
    console.log("URL", url.toString(url))
    const parts = url.split('/')
    
    const bucket_name = parts[2].split('.')[0]

    const objectKey = parts.slice(4).join('/');

    console.log("parsing url", parts, bucket_name, objectKey);
    
    try {
      console.log("Entering try");

      const downloadResult = await downloadData({ key:objectKey}).result;
      console.log("THIS IS THE OBJECT KEY", objectKey);
      const blobThing = await downloadResult.body.blob();
      const pdfURL = URL.createObjectURL(blobThing);

      console.log("image URL",pdfURL)
      console.log('Succeed: ', blobThing);
      return pdfURL
    } catch (error) {
      console.log('Error : ', error);
    }
  } 

  const handleButtonClick = async (rowData) => {
    //navigate(`/viewreport/${rowData.id}`); // Fixed syntax error here
    if (rowData) {
      console.log("URL", rowData.toString(rowData))
      const pdf = await downloadPdf(rowData);
      
      window.open(pdf, '_blank');
    } else {
      // Optionally handle the case where there is no URL; perhaps log an error or display a message
      console.error("No report URL available");
    }
  }

  const handleInputNumber = (inputNumber) =>{

    if (inputNumber > pageOptions.length){
        return pageOptions.length - 1;
      } else if(inputNumber < 1){
        return 0;
      } else{
        return inputNumber - 1;
      }
  }

  console.log("items data",items)
  console.log("items data",items)
  return (
    <>
      <Helmet>
        <title>History of Reports</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>

      <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">
        <div className="flex justify-end w-[100%] md:w-full items-start gap-[2px] absolute top-0 rigth-0">
          <DropdownMenu />
        </div>
        <Sidebar1 isAdmin={isAdmin} className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
        {isLoading ?
          <div className="flex justify-center m-auto">
            <FadeLoader
              color={"303F9F"}
              loading={isLoading}
              size={75}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
          :
          <div className="flex flex-col w-full max-w-[1150px] justify-center md:w-full mr-auto ml-auto">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
            <div className="HistoryTable-container">
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {
                        headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()}>
                            {column.render("Header")}
                          </th>
                        ))
                      }
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {
                    page.map((row) => {
                      prepareRow(row)
                      return (
                        <tr {...row.getRowProps()}>
                          {
                            row.cells.map((cell) => (
                              <td {...cell.getCellProps()}> {cell.render('Cell')} </td>
                            ))
                          }

                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap justify-center mt-2">
              <span>
                <strong className="mr-4">
                  {pageIndex + 1} of {pageOptions.length}
                </strong>
                <span className="mr-4 pl-2">
                  Go to Page: {" "}
                  <input className=" border border-gray-500 w-[50px] text-center hover:border-sky-500" type='number' defaultValue={pageIndex + 1} min={1} max={pageOptions.length}
                    onChange={e => {
                      // const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                      const pageNumber = handleInputNumber(e.target.value)
                      gotoPage(pageNumber)
                    }} />
                </span>
                <select className="mr-4 pl-2 pr-2 border border-gray-200 rounded w-[60px]  hover:border-sky-500" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                  {[10, 25, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </span>
              <button className={`mr-4 pl-2 pr-2 border rounded ${!canPreviousPage && " bg-zinc-400"} hover:bg-zinc-400`} onClick={() => gotoPage(0)} disabled={!canPreviousPage}> {"<<"}</button>
              <button className={`mr-4 pl-2 pr-2 border rounded ${!canPreviousPage && " bg-zinc-400"} hover:bg-zinc-400`} onClick={() => previousPage()} disabled={!canPreviousPage}> Previous</button>
              <button className={`mr-4 pl-2 pr-2 border rounded ${!canNextPage && " bg-zinc-400"} hover:bg-zinc-400`} onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
              <button className={`mr-4 pl-2 pr-2 border rounded ${!canNextPage && " bg-zinc-400"} hover:bg-zinc-400`} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}> {">>"} </button>
            </div>
          </div>
        }
      </div>
    </>
  )
}
