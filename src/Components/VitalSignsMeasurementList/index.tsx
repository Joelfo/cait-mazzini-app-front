import { VitalSignsMeasurementAPI, useVitalSignsMeasurementApi } from "Api/useVitalSignsMeasurementApi"
import AddButton from "Components/IconButton/AddButton";
import { StatsIconButton } from "Components/IconButton/StatsIconButton";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { Button, Modal, Stack, Table } from "react-bootstrap"
import { VitalSignsMeasurement } from "types/Api/VitalSignsMeasurement";
import { VitalSignsMeasurementFormPopup } from "./VitalSignsMeasurementFormPopup";
import { useState } from "react";
import date from 'date-and-time';

export type VitalSignsMeasurementsListProps = {
    show: boolean;
    onClose: () => void,
}

export const VitalSignsMeasurementsList = ({ show, onClose } : VitalSignsMeasurementsListProps) => {
    const vitalSignsMeasurementsAPI = useVitalSignsMeasurementApi();
    const { patient } = useSelectedPatient();
    const { data: vitalSignsMeasurements, refetch: refetchVitalSignsMeasurements } = vitalSignsMeasurementsAPI.useAllByPatient(patient?.id)
    const [ isAddPopupOpened, setIsAddPopupOpened ] = useState<boolean>(false);
    
    return (
        <>
            <Modal show={show} dialogClassName="modal-60w border-dark shadow">
                <Modal.Header className='bg-primary border-dark'>
                    <Modal.Title>Lista de medições</Modal.Title>
                    <Stack direction="horizontal" gap={3}>
                        <Button variant='success' className='border-dark' onClick={() => setIsAddPopupOpened(true)}>Novo</Button>
                        <Button variant='danger' className='border-dark' onClick={onClose}><i className='bi bi-x-lg'/></Button>
                    </Stack>
                </Modal.Header>
                <Modal.Body className='bg-secondary'>
                    <Table striped responsive bordered hover className='table-light border-dark table-bordered'>
                        <thead>
                            <tr className=" w-auto">
                                <th className='text-nowrap'>Data e horário</th>
                                <th className='text-nowrap'>Pa (mmhg)</th>
                                <th className='text-nowrap'>Fc (bpm)</th>
                                <th className='text-nowrap'>Fr (irpm)</th>
                                <th className='text-nowrap'>Tax (°C)</th>
                                <th className='text-nowrap'>Saturação de O² (%)</th>
                                <th className='text-nowrap'>Peso (kg)</th>
                                <th className='text-nowrap'>Altura (m)</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            vitalSignsMeasurements?.map(vitalSignsMeasurement => (
                                <tr className="">
                                    <td className='text-nowrap'>
                                        {
                                            date.format(
                                                date.parse(vitalSignsMeasurement.measurementDateTime, 'YYYY-MM-DDTHH:mm:ss'),
                                                'DD MMM, HH:mm'
                                            )
                                        }
                                    </td>
                                    <td className='text-nowrap'>{vitalSignsMeasurement.mmhgPa + ' mmhg'}</td>
                                    <td className='text-nowrap'>{vitalSignsMeasurement.bpmFc + ' bpm'}</td>
                                    <td className='text-nowrap'>{vitalSignsMeasurement.irpmFr + ' irpm'}</td>
                                    <td className='text-nowrap'>{vitalSignsMeasurement.celsiusTax + ' °C'}</td>
                                    <td className='text-nowrap'>{vitalSignsMeasurement.oxygenSaturationPercentage + '%'}</td>
                                    <td className='text-nowrap'>{vitalSignsMeasurement.kgWeight + ' kg'}</td>
                                    <td className='text-nowrap'>{vitalSignsMeasurement.mHeight + ' m'}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                        
                    </Table>
                </Modal.Body>
                <Modal.Footer className='bg-primary border-dark'/>
            </Modal>
            <VitalSignsMeasurementFormPopup show={isAddPopupOpened} onClose={() => setIsAddPopupOpened(false)} onSave={() => { setIsAddPopupOpened(false); refetchVitalSignsMeasurements(); }}/>
        </>
    )
}