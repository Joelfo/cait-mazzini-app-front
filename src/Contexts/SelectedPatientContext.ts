import { createContext } from "react";
import { Patient } from "types/Api/DTOs/Patient";

export const SelectedPatientContext = createContext<Patient | null>(null);