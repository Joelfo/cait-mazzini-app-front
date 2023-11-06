import { PatientAPI } from "Api/PatientAPI";
import { ClinicalHistoryView } from "Components/ClinicalHistoryForm/ClinicalHistoryView";
import { PatientInfoFields } from "Components/PatientInfoFields";
import { LoadingAlert } from "Components/Utils/Alert/LoadingAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient"
import { useMemo } from "react";
import { Container, Stack } from "react-bootstrap"

export const ClinicalHistoryViewPage = () => {
    
    const { patient, isError: isConnectionError } = useSelectedPatient();

    const patientAPI = new PatientAPI();

    const { data: clinicalHistory, isLoading: isQueryLoading, fetchStatus } = patientAPI.useClincalHistory(patient?.id);

    const isLoading = useMemo(() => isQueryLoading && fetchStatus !== 'idle', [isQueryLoading, fetchStatus]);
    
    return (
        <>
            <LoadingAlert show={isLoading}/>
            <Container>
                <Stack>
                    <PatientInfoFields patient={patient}/>
                </Stack>
                <Stack>
                    {
                        clinicalHistory 
                        &&
                        <ClinicalHistoryView data={clinicalHistory} />
                    }
                </Stack>
            </Container>
        </>

    )
}