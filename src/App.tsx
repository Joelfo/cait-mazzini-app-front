import "./assets/styles/custom.scss";
import './App.css';
import Navbar from './Components/Navbar';
import ReceptionistHome from "Pages/ReceptionistHome";
import { Outlet, Router, RouterProvider, createBrowserRouter } from "react-router-dom";
import { PatientDetails } from "Pages/PatientDetails";
import { PatientForm } from "Pages/PatientForm";
import { TrackingAppointmentChart } from "Pages/TrackingAppointmentChart";
import 'react-quill/dist/quill.snow.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
          path:"/patient",
          element: <PatientDetails/>
        },
        {
          path:"/patientForm",
          element: <PatientForm/>
        },
        {
          path:"/trackingAppointmentChart",
          element: <TrackingAppointmentChart/>
        }
      ]
    }
  ]);
  
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
    </>
    
  );
}

function Root() {
  return (
    <div className="bg-secondary" style={{minHeight: '100vh'}}>
      <div className="navbar-container">
       <Navbar/>
      </div>
      <Outlet/>
    </div>
  )
}

export default App;
