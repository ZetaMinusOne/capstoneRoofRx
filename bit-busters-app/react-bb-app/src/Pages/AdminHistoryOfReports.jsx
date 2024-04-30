import fakeData from "../MOCK_DATA.json";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { useTable, useGlobalFilter, usePagination } from "react-table";
import { GlobalFilter } from "../components/GlobalFilter"
import { Helmet } from "react-helmet";
import "../CSS/HistoryOfReports.css"
import Sidebar1 from "../components/SideBar";
import { useNavigate, useParams, useLocation} from "react-router-dom"
import DropdownMenu from "../components/DropDown";
import FadeLoader from "react-spinners/ClipLoader";

export default function AdminHistoryOfReports() {

  const navigate = useNavigate();
  const { inspectorName } = useParams();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;

  const [items, setItems] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [report, setReport] = useState({
    id:"",
    inspector:"",
    client:"",
    date:"",
    client_address:"",
  })

  useEffect (() =>{
    const fetchData = async () => {
      setIsLoading(true)
      try{
        const url = 'https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/users/table';
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
        setError(error.message);
        setIsLoading(false);
    }
    }
    fetchData(); // Call the async function
  }, [])

  const COLUMNS = [
    {
      Header: "ID",
      accessor: "User_ID",
    },
    {
      Header: "Inspector",
      Cell: ({row}) => `${row.original.User_FirstName} ${row.original.User_LastName}`,
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
      Cell: ({row}) =>(
        <button onClick={() => handleButtonClick(row.original)} className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400">View</button>
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
    setGlobalFilter,
  } = useTable(
    { columns, data },
    useGlobalFilter,
    usePagination
  );

  const handleButtonClick = (rowData) => {
    navigate(`/viewreport/${inspectorName}`);
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

console.log("Items data",items)
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
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} inspectorName={inspectorName}/>
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
                <input className= " border border-gray-500 w-[50px] text-center hover:border-sky-500" type='number' defaultValue={pageIndex + 1} min={1} max={pageOptions.length} 
                  onChange={e => {
                    // const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                    const pageNumber = handleInputNumber(e.target.value)
                    gotoPage(pageNumber)
                  }}  />
              </span>
              <select className="mr-4 pl-2 pr-2 border border-gray-200 rounded w-[60px]  hover:border-sky-500" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                {[10, 25, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </span>
            <button className= {`mr-4 pl-2 pr-2 border rounded ${!canPreviousPage && " bg-zinc-400"} hover:bg-zinc-400`} onClick={() => gotoPage(0)} disabled={!canPreviousPage}> {"<<"}</button>
            <button className= {`mr-4 pl-2 pr-2 border rounded ${!canPreviousPage && " bg-zinc-400"} hover:bg-zinc-400`} onClick={() => previousPage()} disabled={!canPreviousPage}> Previous</button>
            <button className={`mr-4 pl-2 pr-2 border rounded ${!canNextPage && " bg-zinc-400"} hover:bg-zinc-400`} onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
            <button className={`mr-4 pl-2 pr-2 border rounded ${!canNextPage && " bg-zinc-400"} hover:bg-zinc-400`} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}> {">>"} </button>
          </div>
        </div>
}
      </div>
    </>
  )
}
