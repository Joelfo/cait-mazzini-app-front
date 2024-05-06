import { PatientInfoFields } from "Components/PatientInfoFields"
import { Col, Container, Form, Row, Stack } from "react-bootstrap"
import ReactQuill from "react-quill"
import { Patient } from "Api/Types/Patient"
import { PhysicalExam } from "Api/Types/PhysicalExam"

export type PhysicalExamViewProps = {
    physicalExam: PhysicalExam,
    patient: Patient
}

export const PhysicalExamView = ({ patient, physicalExam } : PhysicalExamViewProps) => {
    
    return (
        <Container fluid>
            <Stack gap={4}>
                <Row>
                    <PatientInfoFields patient={patient}/>
                </Row>
                <Row>
                    <Form.Group as={Col} md='2'>
                            <Form.Label>Data</Form.Label>
                            <Form.Control value={physicalExam.date} type='date'/>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            Aspecto geral e emocional
                        </Form.Label>
                        <ReactQuill
                            readOnly
                            value={physicalExam.generalAspect}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            Condições de higiene
                        </Form.Label>
                        <ReactQuill
                            readOnly
                            value={physicalExam.hygieneConditionsObs}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            Cabeça
                        </Form.Label>
                        <ReactQuill
                            readOnly
                            value={physicalExam.headObs}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            Pescoço
                        </Form.Label>
                        <ReactQuill
                            readOnly
                            value={physicalExam.neckObs}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            Tórax
                        </Form.Label>
                        <ReactQuill
                            readOnly
                            value={physicalExam.chestObs}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            MMSS / MMII
                        </Form.Label>
                        <ReactQuill
                            readOnly
                            value={physicalExam.mmssMmiiObs}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            Gênito-Urinário
                        </Form.Label>
                        <ReactQuill
                            readOnly
                            value={physicalExam.urinaryTrackObs}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            Pele e mucosa
                        </Form.Label>
                        <ReactQuill
                            readOnly
                            value={physicalExam.skinAndMucousObs}
                        />
                    </Form.Group>
                </Row>
            </Stack>      
        </Container>
    )
}