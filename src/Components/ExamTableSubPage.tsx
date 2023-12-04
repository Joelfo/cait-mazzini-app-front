import { ComplementaryExamAPI } from "Api/Base/ComplementaryExamAPI"
import { ReactNode, useEffect, useState } from "react"
import { ComplementaryExam } from "types/Api/Exams/ComplementaryExam"
import { SaveLoadingAlert } from "./Utils/Alert/SaveLoadingAlert"
import { SaveSuccessAlert } from "./Utils/Alert/SaveSuccessAlert"
import { Patient } from "types/Api/Patient"
import { Button, Col, Container, Row } from "react-bootstrap"

type ExamTableSubPageProps<TExam extends ComplementaryExam> = {
    api: ComplementaryExamAPI<TExam>,
    renderTable: (data: TExam[]) => ReactNode,
    renderPopup: (show: boolean, onClose: () => void, onSubmit: (data: TExam) => void, patient: Patient) => ReactNode,
    patient: Patient | undefined,
}

export const ExamTableSubPage = <TExam extends ComplementaryExam,>( { api, renderTable, renderPopup, patient } : ExamTableSubPageProps<TExam>) => {
    
    const { data, isLoading, isError } = api.useAllByPatient(patient?.id);
    
    const { mutate: create, isLoading: isCreationLoading, isSuccess: isCreationSuccess } = api.useCreate();
    
    const [ showPopup, setShowPopup ] = useState<boolean>(false);

    const [ showSuccessMessage, setShowSuccessMessage ] = useState<boolean>(false);

    useEffect(() => {
        setShowSuccessMessage(isCreationSuccess);
    }, [isCreationSuccess]);

    return (
        <>
        <Container>
            <Row>
                <Col>
                    {
                        data 
                        &&
                        renderTable(data)
                    }
                </Col>
            </Row>
            <Row>
                <Col md='2'>
                    <Button variant='success' onClick={() => setShowPopup(true)}>Novo</Button>
                </Col>
            </Row>
        </Container>
 
            {
                patient &&
                renderPopup(showPopup, () => setShowPopup(false), create, patient)
            }
            <SaveLoadingAlert show={isCreationLoading}/>
            <SaveSuccessAlert show={showSuccessMessage} onClose={() => setShowSuccessMessage(false)}/>
        </>
    )

}