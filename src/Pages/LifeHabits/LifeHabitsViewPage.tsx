import { PatientAPI } from "Api/PatientAPI";
import { useLifeHabitsInfoApi } from "Api/useLifeHabitsInfoApi";
import { usePatientApi } from "Api/usePatientApi";
import { LifeHabitsForm } from "Components/LifeHabitsForm/LifeHabitsForm";
import { LifeHabitsView } from "Components/LifeHabitsForm/LifeHabitsView";
import { PatientInfoFields } from "Components/PatientInfoFields";
import { LoadingAlert } from "Components/Utils/Alert/LoadingAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient"
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";

export const LifeHabitsViewPage = () => {
    const { patient } = useSelectedPatient();

    const patientAPI = usePatientApi();
    const lifeHabitsInfoApi = useLifeHabitsInfoApi();

    const { data: lifeHabitsInfo, error: connectionError, isLoading, isFetching } = patientAPI.useLifeHabitsInfo(patient?.id);

    const { data: physicalActivities, isLoading: isPhysicalActivitiesLoading } = lifeHabitsInfoApi.usePhysicalActivities(lifeHabitsInfo?.id);

    const { data: contraceptiveMethods, isLoading: isContraceptiveMethodsLoading } = lifeHabitsInfoApi.useContraceptiveMethods(lifeHabitsInfo?.id);

    return (
        <>
            <LoadingAlert show={isLoading || isPhysicalActivitiesLoading || isContraceptiveMethodsLoading}/>
            <Container style={{paddingBottom: 20}}>
                <Stack> 
                    <PatientInfoFields patient={patient}/>
                </Stack>
                <Stack>
                    {
                        lifeHabitsInfo
                        &&
                        <LifeHabitsView
                            data={lifeHabitsInfo}
                            physicalActivities={physicalActivities ?? []}
                            contraceptiveMethods={contraceptiveMethods ?? []}
                        />
                    }
                </Stack>
                <Row className='justify-content-center'>
                    <Col md='2'>
                        <Button variant='info' size='lg'>
                            Editar
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}