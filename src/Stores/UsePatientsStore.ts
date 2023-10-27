import { Patient } from "types/Api/Patient";
import { create } from "zustand";

interface usePatientsStoreStates {
    selectedPatient: Patient | undefined,
    setSelectedPatient: (patient: Patient) => void,
    selectedPatientId: number | undefined,
    setSelectedPatientId: (id: number) => void
}

export const usePatientsStore = create<usePatientsStoreStates>((set) => ({
    selectedPatient: undefined,
    setSelectedPatient: patient => set({selectedPatient: patient}),
    selectedPatientId: undefined,
    setSelectedPatientId: id => set({selectedPatientId: id})
}));