import { PatientAPI } from "Api/PatientAPI";
import { useTrackingAppointmentChartApi } from "Api/useTrackingAppointmentChartApi"
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { useEffect, useMemo, useRef, useState } from "react";
import { Col, Container, Modal, Row, Stack } from "react-bootstrap"
import ReactQuill from "react-quill";
import { DoubleMovingArrows } from "Components/Utils/DoubleMovingArrows";
import { usePatientApi } from "Api/usePatientApi";
import { useUserApi } from "Api/useUserApi";
import { useFirstNurseryAppointmentApi } from "Api/useFirstNurseryAppointmentApi";
import { FirstNurseryAppointmentChart } from "Api/Types/FirstNurseryAppointmentChart";

export type FirstNurseryAppointmentChartPopupProps = {
    show: boolean,
    chart: FirstNurseryAppointmentChart;
    onClose: () => void;
}

export const FirstNurseryAppointmentChartPopup = ({ show, chart, onClose } : FirstNurseryAppointmentChartPopupProps) => {
    const patientAPI = usePatientApi();

    const { patient: selectedPatient } = useSelectedPatient();

    const[ patientIdToSearch, setPatientIdToSearch ] = useState<number>();

    const { data: chartPatient } = patientAPI.useShow(patientIdToSearch);

    const [ showArrowLeft, setShowArrowLeft ] = useState<boolean>(true);
    const [ showArrowRight, setShowArrowRight ] = useState<boolean>(true);

    const userApi = useUserApi();
    const { data: creator } = userApi.useShow(chart?.creatorId);

    useEffect(() => {
        if (!!chart && selectedPatient?.id !== chart.patientId) {
            setPatientIdToSearch(chart.patientId);
        }
    }, [selectedPatient]);

    return (
        <>
            <Modal animation={false} show={show} onHide={onClose} dialogClassName='modal-50w'>
                <Modal.Header className='bg-primary' closeButton closeVariant="light">
                    <h5>
                        Primeira Ficha - Enfermagem
                    </h5>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <hr></hr>
                            </Col>
                        </Row>
                        <Row className='tracking-chart-row'>
                            <Col md='5'>
                                <Stack>
                                    <h3 className='tracking-chart-title'>
                                        Profissional de saúde
                                    </h3>
                                    <p>
                                        { creator?.name }
                                    </p>
                                </Stack>
                            </Col>
                        </Row>
                        <Row>
                            <hr/>
                        </Row>
                        <Row className='justify-content-around tracking-chart-row'>
                            <Col md='5'>
                                <Stack>
                                    <h3 className='tracking-chart-title'>
                                        Nome do Paciente
                                    </h3>
                                    <p>
                                        { chartPatient?.name ?? selectedPatient?.name }
                                    </p>
                                </Stack>
                            </Col>
                            <Col md='5'>
                                <Stack>
                                    <h3 className='tracking-chart-title'>
                                        Nome do médico
                                    </h3>
                                    <p>
                                        adicionar nome do médico
                                    </p>
                                </Stack>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='12'>
                                <hr></hr>
                            </Col>
                        </Row>
                        <Row className='justify-content-start tracking-chart-row'>
                            <Col md='10'>
                                <Stack>
                                    <h3 className='tracking-chart-title'>
                                        Queixas principais
                                    </h3>
                                    
                                    <ReactQuill
                                        value={chart?.mainIssues}
                                        readOnly={true}
                                        theme='bubble'
                                    />
                                    
                                </Stack>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='12'>
                                <hr></hr>
                            </Col>
                        </Row>
                        <Row className='justify-content-start tracking-chart-row'>
                            <Col md='10'>
                                <Stack>
                                    <h3 className='tracking-chart-title'>
                                        Medicamentos em uso
                                    </h3>
                                    
                                    <ReactQuill
                                        style={{minHeight: 'auto'}}
                                        value={chart?.drugsInUse}
                                        readOnly={true}
                                        theme={'bubble'}
                                    />
                                    
                                </Stack>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='12'>
                                <hr></hr>
                            </Col>
                        </Row>
                        <Row className='justify-content-start tracking-chart-row'>
                            <Col md='10'>
                                <Stack>
                                    <h3 className='tracking-chart-title'>
                                        Conduta
                                    </h3>
                                    
                                    <ReactQuill
                                        style={{minHeight: 'auto'}}
                                        value={chart?.conduct}
                                        readOnly={true}
                                        theme={'bubble'}
                                    />
                                    
                                </Stack>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='12'>
                                <hr></hr>
                            </Col>
                        </Row>
                        <Row className='justify-content-start tracking-chart-row'>
                            <Col md='10'>
                                <Stack>
                                    <h3 className='tracking-chart-title'>
                                        Diagnóstico de enfermagem
                                    </h3>
                                    
                                    <ReactQuill
                                        value={chart?.nurseryDiagnostic}
                                        readOnly={true}
                                        theme='bubble'
                                    />
                                    
                                </Stack>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='12'>
                                <hr></hr>
                            </Col>
                        </Row>
                        <Row className='justify-content-start tracking-chart-row'>
                            <Col md='10'>
                                <Stack>
                                    <h3 className='tracking-chart-title'>
                                        Informações complementares
                                    </h3>
                                    
                                    <ReactQuill
                                        value={chart?.complementaryInfo}
                                        readOnly={true}
                                        theme='bubble'
                                    />
                                    
                                </Stack>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    )
}