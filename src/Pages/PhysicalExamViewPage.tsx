import { usePhysicalExamApi } from "Api/usePhysicalExamApi";
import { PhysicalExamView } from "Components/PhysicalExamForm/PhysicalExamView";
import { LoadingAlert } from "Components/Utils/Alert/LoadingAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { useMemo } from "react";
import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

export const PhysicalExamViewPage = () => {

    const [ searchParams, setSearchParams ] = useSearchParams()

    const physicalExamId = useMemo(() => {
        const param = searchParams.get('id');
        return param ? parseInt(param) : undefined
    }, [searchParams]);

    const physicalExamApi = usePhysicalExamApi();
    const { data: physicalExam, isLoading: isPhysicalExamLoading } = physicalExamApi.useShow(physicalExamId);

    const { patient, isLoading: isPatientLoading } = useSelectedPatient();

    return (
        <Container>
            {
                physicalExam
                &&
                patient
                &&
                <PhysicalExamView physicalExam={physicalExam} patient={patient}/>
            }
            <LoadingAlert show={isPatientLoading || isPhysicalExamLoading}/>
        </Container>
    );
};