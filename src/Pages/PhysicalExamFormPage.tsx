import { usePhysicalActivityApi } from "Api/usePhysicalActivityApi"
import { usePhysicalExamApi } from "Api/usePhysicalExamApi";
import { PhysicalExamForm } from "Components/PhysicalExamForm"
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { useEffect } from "react";
import { Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { ETrackingAppointmentChartType } from "Api/Types/enums/ETrackingAppointmentChartType";

export const PhysicalExamFormPage = () => {

    const physicalExamApi = usePhysicalExamApi();

    const { mutate: create, isLoading: isCreationLoading, isSuccess: isCreationSuccess } = physicalExamApi.useCreate();

    const { patient } = useSelectedPatient()

    const navigate = useNavigate();
    
    useEffect(() => {
        if (isCreationSuccess) {
            navigate(`/patient?patientId=${patient?.id}&savedData=true`)
        }
    }, [isCreationSuccess]);

    return (
        <Container>
            <PhysicalExamForm onSubmit={create} physicalExamType={ETrackingAppointmentChartType.FromNursery}/>
            <SaveLoadingAlert show={isCreationLoading}/>
        </Container>
        
    )
}