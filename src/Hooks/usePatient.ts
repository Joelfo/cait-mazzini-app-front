import { usePatientsStore } from "Stores/UsePatientsStore"
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PatientAPI } from 'Api/PatientAPI';

export const usePatient = () => {
    const selectedPatient = usePatientsStore(state => state.selectedPatient);
    const setSelectedPatient = usePatientsStore(state => state.setSelectedPatient);
    const [queryStringParams, setQueryStringParams] = useSearchParams()

    const patientAPI = new PatientAPI();

    const [ patientIdToSearch, setPatientIdToSearch ] = useState<number>();

    const { data: fetchedPatient } = patientAPI.useShow(patientIdToSearch);

    useEffect(() => {
        const patientQueryStringId = Number(queryStringParams.get('patientId'));
        if (!selectedPatient || selectedPatient.id != patientQueryStringId) {
            setPatientIdToSearch(patientQueryStringId);
        }
    }, [])

    useEffect(() => {
        if (fetchedPatient) {
            setSelectedPatient(fetchedPatient);
        }
    }, [fetchedPatient]);


    return selectedPatient;
}