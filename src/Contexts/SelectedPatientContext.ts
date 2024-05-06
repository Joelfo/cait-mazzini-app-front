import { createContext } from "react";
import { Patient } from "Api/Types/Patient";

export const SelectedPatientContext = createContext<Patient | null>(null);