import "./assets/styles/custom.scss";
import './App.css';
import Navbar from './Components/Navbar';
import ReceptionistHome from "Pages/ReceptionistHome";
import { Outlet, Router, RouterProvider, createBrowserRouter } from "react-router-dom";
import { PatientDetails } from "Pages/PatientDetails";
import { PatientForm } from "Pages/PatientForm";

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <Root/>,
      children: [
        {
          path: "",
          element: <ReceptionistHome/>
        },
        {
          path: "/Home",
          element: <ReceptionistHome/>
        },
        {
          path:"patient/:patientId",
          element: <PatientDetails/>
        },
        {
          path:"patientForm",
          element: <PatientForm/>
        },
        {
          path: "patientForm/:patientId",
          element: <PatientForm/>
        }
      ]
    }
  ])
  return (
    <>
    <RouterProvider router={router}/>
    </>
    
  );
}

function Root() {
  return (
    <>
      <div className="navbar-container">
       <Navbar/>
      </div>
      <Outlet/>
    </>
  )
}

export default App;
