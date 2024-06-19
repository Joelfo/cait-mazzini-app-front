import "./assets/styles/custom.scss";
import './App.css';
import Navbar from './Components/Navbar';
import Home from "Pages/Home";
import { Outlet, Router, RouterProvider, createBrowserRouter } from "react-router-dom";
import { PatientDetails } from "Pages/Patient/PatientDetails";
import { PatientForm } from "Pages/Patient/PatientForm";
import { TrackingAppointmentChart } from "Pages/TrackingAppointmentChart";
import 'react-quill/dist/quill.snow.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PatientInfo } from "Pages/Patient/PatientInfo";
import { LifeHabitsForm } from "Components/LifeHabitsForm/LifeHabitsForm";
import { ClinicalHistoryForm } from "Components/ClinicalHistoryForm/ClinicalHistoryForm";
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
import { ClinicalHistoryFormPage } from "Pages/ClinicalHistory/ClinicalHistoryFormPage";
import { PhysicalExamFormPage } from "Pages/PhysicalExamFormPage";
import { PhysicalExamViewPage } from "Pages/PhysicalExamViewPage";
import { UserFormPage } from "Pages/Users/UserFormPage";
import { Container } from "react-bootstrap";
import { UserList } from "Components/User/UserList";
import { UserListPage } from "Pages/Users/UserListPage";
import { FirstNurseryAppointmentForm } from "Components/FirstAppointment/FirstNurseryAppointmentForm";
import { FirstMedicalAppointmentForm } from "Components/FirstAppointment/FirstMedicalAppointmentForm";

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
              element: <Home/>
            },
            {
              path: "/Home",
              element: <Home/>
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
              path: '/exams',
              element: <ExamsPage/>
            },
            {
              path: '/clinicalHistoryForm',
              element: <ClinicalHistoryFormPage/>
            },
            {
              path: '/physicalExamForm',
              element: <PhysicalExamFormPage/>
            },
            {
              path: '/physicalExam',
              element: <PhysicalExamViewPage/>
            },
            {
              path: '/user',
              element: <UserFormPage/>
            },
            {
              path: '/userList',
              element: <UserListPage/>
            },
            {
              path: '/firstNurseryChart',
              element: <FirstNurseryAppointmentForm/>
            },
            {
              path: '/firstMedicalChart',
              element: <FirstMedicalAppointmentForm/>
            },
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

        <Outlet/>
    </div>
  )
}

export default App;
