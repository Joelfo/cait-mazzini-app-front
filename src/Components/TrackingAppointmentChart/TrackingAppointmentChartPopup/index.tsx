import { PatientAPI } from "Api/PatientAPI";
import { TrackingAppointmentChartAPI } from "Api/TrackingAppointmentChartAPI"
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Modal, Row, Stack } from "react-bootstrap"
import './styles.css';
import ReactQuill from "react-quill";
import { DoubleMovingArrows } from "Components/Utils/DoubleMovingArrows";

export type TrackingAppointmentChartPopupProps = {
    show: boolean,
    chartId: number;
    onClose: () => void;
}

export const TrackingAppointmentChartPopup = ({ show, chartId, onClose } : TrackingAppointmentChartPopupProps) => {
    const trackingAppointmentChartAPI = new TrackingAppointmentChartAPI();
    const patientAPI = new PatientAPI();

    const [ selectedId, setSelectedId ] = useState<number>();
    const { data: trackingAppointmentChart } = trackingAppointmentChartAPI.useShow(selectedId);
    const selectedPatient = useSelectedPatient();

    const[ patientIdToSearch, setPatientIdToSearch ] = useState<number>();

    const { data: chartPatient } = patientAPI.useShow(patientIdToSearch);

    const [ showArrowLeft, setShowArrowLeft ] = useState<boolean>(true);
    const [ showArrowRight, setShowArrowRight ] = useState<boolean>(true);

    useEffect(() => {
        if (!!trackingAppointmentChart && selectedPatient?.id !== trackingAppointmentChart.patientId) {
            setPatientIdToSearch(trackingAppointmentChart.patientId);
        }
    }, [selectedPatient]);
    
    useEffect(() => {
        if (show) {
            setSelectedId(chartId);
        } 
    }, [show]);

    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName='modal-50w'>
                <Modal.Header className='bg-primary' closeButton closeVariant="light">
                    <h5>
                        Ficha de Acompanhamento
                    </h5>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <hr></hr>
                            </Col>
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
                        <Row className='tracking-chart-row'>
                            <Col>
                                <Stack>
                                    <h3 className='tracking-chart-title'>
                                        Esquema
                                    </h3>
                                    <p>
                                        {trackingAppointmentChart?.schema}
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
                                        Evolução
                                    </h3>
                                    
                                    <ReactQuill
                                        value={trackingAppointmentChart?.evolution}
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
                                        Conduta
                                    </h3>
                                    
                                    <ReactQuill
                                        style={{minHeight: 'auto'}}
                                        value={trackingAppointmentChart?.conduct}
                                        readOnly={true}
                                        theme={'bubble'}
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