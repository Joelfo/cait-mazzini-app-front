import { useClinicalHistoryApi } from "Api/useClinicalHistoryApi";
import { ClinicalHistoryForm } from "Components/ClinicalHistoryForm/ClinicalHistoryForm";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { useEffect, useMemo } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const ClinicalHistoryFormPage = () => {

    const { patient } = useSelectedPatient()

    const clinicalHistoryApi = useClinicalHistoryApi();

    const { mutate: create, isLoading: isCreationLoading, isSuccess: isCreationSuccessed } = clinicalHistoryApi.useCreate();

    const { mutate: update, isLoading: isUpdateLoading, isSuccess: isUpdateSuccessed } = clinicalHistoryApi.useUpdate();

    const isSuccess = useMemo(() => isUpdateSuccessed || isCreationSuccessed, [isCreationSuccessed, isUpdateSuccessed]);

    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            navigate(`/patient?patientId=${patient}&savedData=true`);
        }
    }, [isSuccess]);

    return (
        <Container>
            <ClinicalHistoryForm onSubmit={create}/>
            <SaveLoadingAlert show={isCreationLoading}/>
        </Container>
    );
}