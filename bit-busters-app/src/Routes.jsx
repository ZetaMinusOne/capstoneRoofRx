import React from "react";
import { useRoutes } from "react-router-dom";
import NotFound from "./Pages/NotFound";
import SignUpPage from "./Pages/SignUp";
import Signinpage from "./Pages/SignIn";
import AdminHomePage from "./Pages/AdminHome";
import AnalyzeImagePage from "./Pages/AnalyzeImages";
import ResetPasswordPage from "./Pages/ResetPassword";
import Homepage from "./Pages/Home";
import HistoryOfReports from "./Pages/HistoryOfReports"
import AccountInformationPage from "./Pages/AccountInformation"
import ReportGeneratedPage from "./Pages/ReportGenerated"
import ReportGeneratedTilesPage from "./Pages/ReportGenerationTiles"
import ReportGeneratedShinglesPage from "./Pages/ReportGenerationShingles"

import ReportGenerationPage from "./Pages/ReportGeneration"
import EditReport from "./Pages/EditReport"
import ManageInspectorsPage from "./Pages/ManageInspectors"
import ViewReportPage from "./Pages/ViewReportPage"
import AdminHistoryOfReports from "./Pages/AdminHistoryOfReports"
import { useState } from "react";
import { reportGenerationContext } from "./components/Context";
import ResultsPage from "./Pages/Results";
import ReportGeneratedTiles from "./Pages/ReportGeneratedTiles";

const ProjectRoutes = () => {

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    // dateVisited: "",
    zipcode: "",
    inspectorFirstName: "",
    inspectorPhoneNumber: "",
    inspectorEmail: "",
    comments: "",
    images: [],
    date: "", // Get current date
    pdfBase64: "",
    // pipe2: "not broken",
    // pipe3: "broken",
    brokenPipes: 10,
    price: 10,
    get total() {
      return this.price * this.brokenPipes;
    },
  });


  let element = useRoutes([
    { path: "/", element: <Signinpage /> },
    { path: "*", element: <NotFound /> },
    {
      path: "/signup",
      element: <SignUpPage />,
    },
    {
      path: "/adminhome",
      element: <reportGenerationContext.Provider value={{ data, setValues: setData }}>
      <AdminHomePage />
      </reportGenerationContext.Provider>,
    },
    {
      path: "/analyzeimages",
      element: <reportGenerationContext.Provider value={{ data, setValues: setData }}>
      <AnalyzeImagePage />
      </reportGenerationContext.Provider>,
    },
    {
      path: "/results",
      element: <reportGenerationContext.Provider value={{ data, setValues: setData }}>
      <ResultsPage />
      </reportGenerationContext.Provider>,
    },
    {
      path: "/tilesreport",
      element: <reportGenerationContext.Provider value={{ data, setValues: setData }}>
      <ReportGeneratedTiles />
      </reportGenerationContext.Provider>,
    },

    {
      path: "/resetpassword",
      element: <ResetPasswordPage />,
    },

    {
      path: "/home",
      element: <reportGenerationContext.Provider value={{ data, setValues: setData }}><Homepage />
      </reportGenerationContext.Provider>,
    },
    {
      path: "/history",
      element: <HistoryOfReports />,
    },
    {
      path: `/adminhistory/:inspectorName`,
      element: <AdminHistoryOfReports />,
    },
    {
      path: "/adminhistory",
      element: <AdminHistoryOfReports />,
    },
    {
      path: "/accountinformation",
      element: <AccountInformationPage />,
    },
    {
      path: "/reportgenerated",
      element: <reportGenerationContext.Provider value={{ data, setValues: setData }}>
        <ReportGeneratedPage />
      </reportGenerationContext.Provider>,
    },
    {
      path: "/reportgenerationtiles",
      element: <reportGenerationContext.Provider value={{ data, setValues: setData }}>
        <ReportGeneratedTilesPage />
      </reportGenerationContext.Provider>,

    },
    {
      path: "/reportgenerationshingles",
      element: <reportGenerationContext.Provider value={{ data, setValues: setData }}>
        <ReportGeneratedShinglesPage />
      </reportGenerationContext.Provider>,
    },
    {
      path: "/reportgeneration",
      element: <reportGenerationContext.Provider value={{ data, setValues: setData }}>
      <ReportGenerationPage />
      </reportGenerationContext.Provider >,
    },
    {
      path: "/editreport",
      element: <reportGenerationContext.Provider value={{ data, setValues: setData }}>
        <EditReport />
      </reportGenerationContext.Provider>,
    },
{
  path: "/manageinspectors",
    element: <ManageInspectorsPage />,
    },
{
  path: "/viewreport/",
    element: <ViewReportPage />,
    },
{
  path: "/viewreport/:id",
    element: <ViewReportPage />,
    },
    

  ]);

return element;
};

export default ProjectRoutes;
