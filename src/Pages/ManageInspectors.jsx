import fakeData from "../MOCK_DATA.json";
import React, { useState, useEffect, useMemo } from "react";
import { useTable, useGlobalFilter, usePagination } from "react-table";
import { GlobalFilter } from "../components/GlobalFilter";
import { Helmet } from "react-helmet";
import "../CSS/HistoryOfReports.css";
import Sidebar1 from "../components/SideBar";
import { useNavigate,useLocation } from "react-router-dom";
import Modal from "../components/Modals/Modal";
import DropdownMenu from "../components/DropDown";
import FadeLoader from "react-spinners/ClipLoader";
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';
import { post } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';

Amplify.configure(config);


export default function HistoryOfReports() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [User_ID, setUser_ID] = useState("");
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;

  const [items, setItems] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // const [table, setTable] = useState({
  //   id:"",
  //   inspector:"",
  // })

  useEffect (() =>{
    const fetchData = async () => {
      setIsLoading(true)
      try{
        const url = 'https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/users';
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Data:", data); // See exactly what's being fetched
      setItems(data); // Set fetched data into state
      setIsLoading(false); // Set loading to false once data is loaded

      if (data.users && Array.isArray(data.users)) {
        setItems(data.users);  // Set the users array to items
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

  const handleDeleteUser = async (userId) => {
    const userToUpdate = items.find(user => user.User_ID === userId);
    if (!userToUpdate) {
      console.error("User not found!");
      return;
    }
  
    // Update isActive status
    const updatedUser = { ...userToUpdate, isActive: false };
  
    const url = `https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/users/${userId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("EMAIL TO ERASE", userToUpdate.Email);
      
      const authSession = await fetchAuthSession();

      console.log("AUTH SESSION", authSession);

      let apiName = 'AdminQueries';
      let path = '/disableUser';
      let options = {
          body: {
            "username" : userToUpdate.Email,
          }, 
          headers: {
            'Content-Type' : 'application/json',
            Authorization: `${(await fetchAuthSession()).tokens.accessToken}`
          } 
      }
      post({apiName, path, options});
  
      console.log("User deactivated successfully");
      fetchUpdatedUsers(); // Fetch the updated list of users to reflect the change in the UI
    } catch (error) {
      console.error('Update operation error:', error);
    }
  };

  const fetchUpdatedUsers = async () => {
    setIsLoading(true);
    try {
      const url = 'https://zs9op711v1.execute-api.us-east-1.amazonaws.com/dev/users';
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.users) {
        setItems(data.users);
      } else {
        setItems([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const COLUMNS = [
    {
      Header: "ID",
      accessor: "User_ID",
    },
    {
      Header: "Inspector",
      accessor: (row) => `${row.FirstName} ${row.LastName}`,
      
    },
    {
      Header: "Account",
      accessor: "account",
      Cell: ({ row }) => (
        <button
          onClick={() => handlePopupModal(row.original.User_ID)}
          className=" text-white-A700 border border-gray-500 bg-red-600  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-red-800"
        >
          Delete
        </button>
      ),
    },
    {
      Header: "Reports",
      accessor: "reports",
      Cell: ({ row }) => (
        <button
          onClick={() => handleReportsButtonClick(row.original.FirstName, row.original.LastName)}
          className="border border-gray-500 bg-zinc-300  rounded-3xl pt-1 pb-1 pl-2 pr-2 hover:bg-zinc-400"
        >
          View
        </button>
      ),
    },
  ];

  const data = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const columns = useMemo(() => COLUMNS, []);

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
  } = useTable({ columns, data }, useGlobalFilter, usePagination);

  const handlePopupModal = (row) => {
    setUser_ID(row);
    setModal(!modal);
  };

  const handleReportsButtonClick = (firstname, lastName) => {
    const name = firstname + " " + lastName;
    navigate(`/adminhistory/${name}`, { state: { isAdmin } });
    // navigate("/analyzeimages", { state: { formData, isAdmin } });
  };


  const handleInputNumber = (inputNumber) =>{

    if (inputNumber > pageOptions.length){
        return pageOptions.length - 1;
      } else if(inputNumber < 1){
        return 0;
      } else{
        return inputNumber - 1;
      }
  }

  console.log("Data drom DB",items)
  return (
    <>
      <Helmet>
        <title>Manage Inspectors</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>

      <div className="flex justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">
        <div className="flex justify-end w-[100%] md:w-full items-start gap-[2px] absolute top-0 right-0">
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
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <div className="HistoryTable-container">
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap justify-center mt-2">
            <span>
              <strong className="mr-4">
                {pageIndex + 1} of {pageOptions.length}
              </strong>
              <span className="mr-4 pl-2">
                Go to Page:{" "}
                <input
                  className=" border border-gray-500 w-[50px] text-center hover:border-sky-500"
                  type="number"
                  defaultValue={pageIndex + 1}
                  min={1}
                  max={pageOptions.length}
                  onChange={(e) => {
                    const pageNumber = handleInputNumber(e.target.value)
                    gotoPage(pageNumber);
                  }}
                />
              </span>
              <select
                className="mr-4 pl-2 pr-2 border border-gray-200 rounded w-[60px]  hover:border-sky-500"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[10, 25, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </span>
            <button
              className={`mr-4 pl-2 pr-2 border rounded ${!canPreviousPage && " bg-zinc-400"} hover:bg-zinc-400`}
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </button>
            <button
              className={`mr-4 pl-2 pr-2 border rounded ${!canPreviousPage && " bg-zinc-400"} hover:bg-zinc-400`}
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              Previous
            </button>
            <button
              className={`mr-4 pl-2 pr-2 border rounded ${!canNextPage && " bg-zinc-400"} hover:bg-zinc-400`}
              onClick={nextPage}
              disabled={!canNextPage}
            >
              Next
            </button>
            <button
              className={`mr-4 pl-2 pr-2 border rounded ${!canNextPage && " bg-zinc-400"} hover:bg-zinc-400`}
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </button>
          </div>
        </div>
}
      </div>
      {modal && <Modal toggleModal={() => setModal(!modal)} User_ID={User_ID} handleDeleteUser= {handleDeleteUser}/>}
    </>
  );
}
