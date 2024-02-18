import { PatientAPI } from "Api/PatientAPI";
import { usePatientApi } from "Api/usePatientApi";
import { LifeHabitsForm } from "Components/LifeHabitsForm";
import { LifeHabitsView } from "Components/LifeHabitsForm/LifeHabitsView";
import { PatientInfoFields } from "Components/PatientInfoFields";
import { LoadingAlert } from "Components/Utils/Alert/LoadingAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient"
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";

export const LifeHabitsViewPage = () => {
    const { patient } = useSelectedPatient();

    const patientAPI = usePatientApi();

    const { data: lifeHabitsInfo, error: connectionError, isLoading, isFetching } = patientAPI.useLifeHabitsInfo(patient?.id);

    return (
        <>
            <LoadingAlert show={isLoading && isFetching}/>
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