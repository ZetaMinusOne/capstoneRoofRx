import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "Pages/NavMenu";
import NotFound from "Pages/NotFound";
import SignUpPage from "Pages/SignUp";
import Signinpage from "Pages/SignIn";
import AdminHomePage from "Pages/AdminHome";
import AnalyzeImagePage from "Pages/AnalyzeImages";
import ResetPasswordPage from "Pages/ResetPassword";
import Homepage from "Pages/Home";
import HistoryOfReports from "./Pages/HistoryOfReports"
import AccountInformationPage from "./Pages/AccountInformation"
import ReportGeneratedPage from "./Pages/ReportGenerated"
import ReportGenerationPage from "./Pages/ReportGeneration"
import ManageInspectorsPage from "./Pages/ManageInspectors"
import ViewReportPage from "./Pages/ViewReportPage"
import AdminHistoryOfReports from "./Pages/AdminHistoryOfReports"
import { useState } from "react";
import { reportGenerationContext } from "components/Context";

const ProjectRoutes = () => {

  const [data, setData] = useState({
    companyName: "Bit Busters",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    dateVisited: "",
    zipcode: "",
    inspectorFirstName: "Juan del Pueblo",
    inspectorPhoneNumber: "7871234567",
    inspectorEmail: "juan.delpueblo78@upr.edu",
    comments: "Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes.",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    date: new Date().toLocaleDateString(), // Get current date
    pipe1: "broken",
    pipe2: "not broken",
    pipe3: "broken",
    brokenPipes: 2,
    price: 10,
    get total() {
      return this.price * this.brokenPipes;
    },
  });


  let element = useRoutes([
    { path: "/", element: <Home /> },
    { path: "*", element: <NotFound /> },
    {
      path: "/signup",
      element: <SignUpPage />,
    },
    {
      path: "/signin",
      element: <Signinpage />,
    },
    {
      path: "/adminhome",
      element: <AdminHomePage />,
    },
    {
      path: "/analyzeimages",
      element: <AnalyzeImagePage />,
    },

    {
      path: "/resetpassword",
      element: <ResetPasswordPage />,
    },

    {
      path: "/home",
      element: <Homepage />,
    },
    {
      path: "/history",
      element: <HistoryOfReports />,
    },
    {
      path: `/adminhistory/:inspector`,
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
      path: "/reportgeneration",
      element: <reportGenerationContext.Provider value={{ data, setValues: setData }}>
      <ReportGenerationPage />
      </reportGenerationContext.Provider >,
    },
{
  path: "/manageinspectors",
    element: <ManageInspectorsPage />,
    },
{
  path: "/viewreport/:id",
    element: <ViewReportPage />,
    },

  ]);

return element;
};

export default ProjectRoutes;
