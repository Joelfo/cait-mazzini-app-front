import { Col, Form, Row } from "react-bootstrap"
import { Patient } from "types/Api/DTOs/Patient"

export const PatientInfoFields = ({ patient } : PatientInfoFieldProps) => {
    return (
        <Row className='mt-5'>
            <Form.Group as={Col} md='3'>
                <Form.Label>Paciente</Form.Label>
                <Form.Control disabled value={patient?.name ?? ''}/>
            </Form.Group>
            <Form.Group as={Col} md='2'>
                <Form.Label>Nº do Prontuário</Form.Label>
                <Form.Control disabled value={patient?.recordCode ?? ''}/>
            </Form.Group>  
        </Row>
    )
}

type PatientInfoFieldProps = {
    patient?: Patient
}