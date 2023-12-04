import { createContext } from "react";
import { Patient } from "types/Api/Patient";

export const SelectedPatientContext = createContext<Patient | null>(null);