import { usePatientsStore } from "Stores/UsePatientsStore"
import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { PatientAPI } from 'Api/PatientAPI';

export const useSelectedPatient = () => {
    const selectedPatient = usePatientsStore(state => state.selectedPatient);
    const setSelectedPatient = usePatientsStore(state => state.setSelectedPatient);
    const [queryStringParams, setQueryStringParams] = useSearchParams()

    const patientAPI = new PatientAPI();

    const [ patientIdToSearch, setPatientIdToSearch ] = useState<number>();

    const { data: fetchedPatient, isError, isLoading: isPatientLoading, fetchStatus } = patientAPI.useShow(patientIdToSearch);
    
    const isLoading = useMemo(() => isPatientLoading && fetchStatus !== 'idle', [isPatientLoading, fetchStatus])

    useEffect(() => console.log(isLoading), [isLoading])

    useEffect(() => {
        const patientQueryStringId = Number(queryStringParams.get('patientId'));
        if (!selectedPatient || (selectedPatient.id != patientQueryStringId && !!patientQueryStringId)) {
            setPatientIdToSearch(patientQueryStringId);
        }
    }, [])

    useEffect(() => {
        if (fetchedPatient) {
            setSelectedPatient(fetchedPatient);
        }
    }, [fetchedPatient]);


    return { patient: selectedPatient, isError, isLoading };
}