import { Patient } from "types/Patient";
import { create } from "zustand";

interface usePatientsStoreStates {
    selectedPatient: Patient | null,
    setSelectedPatient: (patient: Patient) => void,
    selectedPatientId: number | null,
    setSelectedPatientId: (id: number) => void
}

export const usePatientsStore = create<usePatientsStoreStates>((set) => ({
    selectedPatient: null,
    setSelectedPatient: patient => set({selectedPatient: patient}),
    selectedPatientId: null,
    setSelectedPatientId: id => set({selectedPatientId: id})
}));