import "./assets/styles/custom.scss";
import './App.css';
import Navbar from './Components/Navbar';
import ReceptionistHome from "Pages/ReceptionistHome";
import { Outlet, Router, RouterProvider, createBrowserRouter } from "react-router-dom";
import { PatientDetails } from "Pages/Patient/PatientDetails";
import { PatientForm } from "Pages/Patient/PatientForm";
import { TrackingAppointmentChart } from "Pages/TrackingAppointmentChart";
import 'react-quill/dist/quill.snow.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PatientInfo } from "Pages/Patient/PatientInfo";
import { LifeHabitsForm } from "Components/LifeHabitsForm";
import { ClinicalHistoryForm } from "Components/ClinicalHistoryForm";
import { FirstNurseryChartPage } from "Pages/FirstNurseryChart";

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
        },
        {
          path:"/patientInfo",
          element: <PatientInfo/>
        },
        {
          path:'/lifeHabits',
          element: <></>
        },
        {
          path: '/clinicalHistory',
          element: <></>
        },
        {
          path: '/physicalExam',
          element: <></>
        },
        {
          path: '/firstNurseryChart',
          element: <FirstNurseryChartPage/>
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
