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
import * as yup from 'yup';
import { LifeHabitsViewPage } from "Pages/LifeHabits/LifeHabitsViewPage";
import { ClinicalHistoryViewPage } from "Pages/ClinicalHistory/ClinicalHistoryViewPage";
import { ExamsPage } from "Pages/Exams/ExamsPage";
import { LifeHabitsFormPage } from "Pages/LifeHabits/LifeHabitsFormPage";
import { LoginPage } from "Pages/LoginPage";
import { useAuthStore } from "Stores/useAuthStore";
import { useCookies } from "react-cookie";
import { SecureRoute } from "SecureRoute";
import { useMemo } from "react";

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <Root/>,
      children: [
        {
          element: <SecureRoute/>,
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
              path:"patient",
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
              path: '/lifeHabits',
              element: <LifeHabitsFormPage />
            },
            {
              path:'/lifeHabitsView',
              element: <LifeHabitsViewPage/>
            },
            {
              path: '/clinicalHistory/view',
              element: <ClinicalHistoryViewPage/>
            },
            {
              path: '/physicalExam',
              element: <></>
            },
            {
              path: '/firstNurseryChart',
              element: <FirstNurseryChartPage/>
            },
            {
              path: '/exams',
              element: <ExamsPage/>
            }
          ]
        }, 
        {
          path: '/login',
          element: <LoginPage/>
        }
      ]
    }
  ]);
  
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  }), []);
  

  const requiredInputMessage = 'O campo ${label} é obrigatório.';
  const positiveInputMessage = 'O campo ${label} deve conter um valor positivo.';
  const numericInputMessage = 'O campo ${label} deve conter um número.';

  yup.setLocale({
    mixed: {
      default: 'O valor informado para o campo ${label} não é válido',
      required: requiredInputMessage,
      defined: requiredInputMessage
    },
    number: {
      positive: positiveInputMessage,
      
    }

  });
 
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
