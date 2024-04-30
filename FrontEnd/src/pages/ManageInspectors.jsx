import fakeData from "../MOCK_DATA.json";
import * as React from "react";
import { useTable, useGlobalFilter, usePagination } from "react-table";
import { GlobalFilter } from "../components/GlobalFilter"
import { Helmet } from "react-helmet";
import "../CSS/HistoryOfReports.css"
import Sidebar1 from "../components/SideBar";
import { useNavigate } from "react-router-dom"
import Modal from "../components/Modals/Modal";
import {useState} from "react"
import DropdownMenu from "components/DropDown";

export default function HistoryOfReports() {

  const navigate = useNavigate();
  // const [showConfirmation, setShowConfirmation] = React.useState(false); // State to control the visibility of the confirmation dialog
  // const [selectedRowData, setSelectedRowData] = React.useState(null); // State to store the data of the selected row
  const [modal, setModal] = useState(false);
  const [inspectorName, setInspectorName] = useState();
  // const dropDownOptions = [
  //   { label: "Personal Info", value: "option1" },
  //   { label: "Log Out", value: "option2" },
  // ];


  const COLUMNS = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Inspector",
      accessor: "inspector",
    },
    {
      Header: "Account",
      accessor: "account",
      Cell: ({ row }) => (
        <button onClick={() => handlePopupModal(row.original)} className=" text-white-A700 border border-gray-500 bg-red-600  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-red-800">Delete</button>
      )
    },
    {
      Header: "Reports",
      accessor: "reports",
      Cell: ({ row }) => (
        <button onClick={() => handleReportsButtonClick(row.original)} className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400" >View</button>
      )
    },
  ];

  const data = React.useMemo(() => fakeData, []);
  const columns = React.useMemo(() => COLUMNS, []);

  const { getTableProps,
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
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, usePagination);

  const { globalFilter, pageIndex, pageSize } = state

  const handlePopupModal = (row) => {
    setInspectorName(row.inspector);
    setModal(!modal);
    console.log("setting to delete", inspectorName);
  }

  const handleReportsButtonClick = (rowData) => {
    navigate(`/adminhistory/${rowData.inspector}`);
  }

  // const handleConfirm = () => {
  //   // Hide confirmation dialog
  //   setShowConfirmation(false);

  //   // Navigate to another page with the details of the selected row
  //   navigate("Deleting account: ", selectedRowData.id);
  // };

  // const handleCancel = () => {
  //   // Hide confirmation dialog
  //   setShowConfirmation(false);
  // };

  return (
    <>
      <Helmet>
        <title>Manage Inspectors</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      
      <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">
      <div className="flex justify-end w-[100%] md:w-full items-start gap-[2px] absolute top-0 rigth-0">
          <DropdownMenu />
        </div>
        <Sidebar1 className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
        <div className="flex flex-col w-full max-w-[1150px] justify-center md:w-full mr-auto ml-auto">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
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
                    const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
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
      </div>
      { modal && (<Modal toggleModal = { () => setModal(!modal)} accountName = {inspectorName} />)}
      
    </>
  )
}