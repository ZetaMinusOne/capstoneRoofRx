import React, {useState} from "react";
import ProjectRoutes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";



function App() {

  // const [data, setData] = useState({
  //   companyName: "Bit Busters",
  //   firstName: "",
  //   lastName: "",
  //   phoneNumber: "",
  //   email: "",
  //   address1: "",
  //   address2: "",
  //   country: "",
  //   state: "",
  //   city: "",
  //   dateVisited: "",
  //   zipcode:"",
  //   inspectorFirstName: "",
  //   inspectorPhoneNumber: "",
  //   inspectorEmail: "",
  //   comments: "Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes were found broken in the kitchen area. Two pipes.",
  //   images: [
  //     "https://example.com/image1.jpg",
  //     "https://example.com/image2.jpg",
  //   ],
  //   date: new Date().toLocaleDateString(), // Get current date
  //   pipe1: "broken",
  //   pipe2: "not broken",
  //   pipe3: "broken",
  //   brokenPipes: 2,
  //   price: 10,
  //   get total() {
  //     return this.price * this.brokenPipes;
  //   },
  // });

  return (
    <>
    {/* <reportGenerationContext.Provider value= {{ data, setValues: setData }}> */}
      <Router>
        <ProjectRoutes />
      </Router>
    {/* </reportGenerationContext.Provider> */}
    </>
  );
}

export default App;
