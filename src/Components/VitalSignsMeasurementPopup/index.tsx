import { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, Modal, ModalBody, OverlayTrigger, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { VitalSignsMeasurement } from "types/VitalSignsMeasurement";
import { HookControlledFormControl } from "util/components/HookControlledFormControl";
import { justRequiredRule } from "util/validation";
import * as Api from 'Api/VitalSignsMeasurementAPI';
import './index.css';
import { SaveErrorAlert } from "Components/Utils/SaveErrorAlert";
import { usePatient } from "Hooks/usePatient";
import DateTimePicker from "react-datetime-picker";
import { SaveSuccessAlert } from "Components/Utils/SaveErrorAlert/SaveSuccessAlert";
import { getActualDate, getActualTime } from "util/DateUtils";

export interface IVitalSignsMeasurementPopupProps {
    show: boolean,
    onClose: () => void,
}

export const VitalSignsMeasurementPopup = ({ show, onClose } : IVitalSignsMeasurementPopupProps) => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue
    } = useForm<VitalSignsMeasurement>();

    const onSubmit = (data: VitalSignsMeasurement) => { mutate(data); onClose(); }

    const { mutate, isLoading, isError, isSuccess } = Api.usePost();

    const [ showErrorAlert, setShowErrorAlert ] = useState<boolean>(false);
    const [ showSuccessAlert, setShowSuccessAlert ] = useState<boolean>(false);
    const handleCloseAlert = () => setShowErrorAlert(false);

    const patient = usePatient();

    const [ date, setDate ] = useState<string>('');
    const [ time, setTime ] = useState<string>('');

    const setDateTime = (date : string, time : string) => {
        console.log(date);
        const datetime = date + 'T' + time + ':00+00:00';
        console.log(datetime);
        setValue('measurementDateTime', datetime);
    }

    useEffect(() => {
        setShowErrorAlert(isError);
    }, [isError])

    useEffect(() => {
        setShowSuccessAlert(isSuccess);
    }, [isSuccess]);


    useEffect(() => {
        if (patient) {
            setValue('patient.id', patient.id);
        }
    }, [patient]);

    useEffect(() => setDateTime(date, time), [date, time]);

    useEffect(() => {
        const actualDate = getActualDate();
        setDate(actualDate);
        const actualTime = getActualTime();
        setTime(actualTime);
    }, [])

    return (
        <Fragment>
            <Modal size='xl' show={show} onClose={onClose}>
                <Modal.Header className='bg-primary border-dark'>
                    <Modal.Title> Medição de sinais vitais </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body className='bg-secondary'>
                        
                            <Row className='d-flex justify-content-evenly align-items-start gx-5'>
                                <Form.Group as={Col}>
                                    <Form.Label>PA (mmHg)</Form.Label>
                                    <HookControlledFormControl control={control} name='paMmhg' formControlType='text' rules={justRequiredRule('PA mmhg)')}/>
                                    <Form.Control.Feedback type='invalid'>{errors.paMmhg?.message}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>FC (bpm)</Form.Label>
                                    <HookControlledFormControl control={control} name='fcBpm' formControlType='text' rules={justRequiredRule('FC (bpm)')}/>
                                    <Form.Control.Feedback type='invalid'>{errors.fcBpm?.message}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Fr (irpm)</Form.Label>
                                    <HookControlledFormControl control={control} name='frIrpm' formControlType='text' rules={justRequiredRule('Fr (Irpm)')}/>
                                    <Form.Control.Feedback type='invalid'>{errors.frIrpm?.message}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Tax °C</Form.Label>
                                    <HookControlledFormControl control={control} name='taxCelsius' formControlType='text' rules={justRequiredRule('Peso (kg)')}/>
                                    <Form.Control.Feedback type='invalid'>{errors.taxCelsius?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row offsetCol className='mt-5 d-flex justify-content-evenly align-items-start gx-5'>
                                <Form.Group as={Col}>
                                    <Form.Label>Saturação de O² (%)</Form.Label>
                                    <HookControlledFormControl control={control} name='oxygenSaturationPercentage' rules={justRequiredRule('Saturação de O² (%)')} formControlType='text'/>
                                    <Form.Control.Feedback type='invalid'>{errors.oxygenSaturationPercentage?.message}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Peso (kg)</Form.Label>
                                    <HookControlledFormControl control={control} name='weightKg' rules={justRequiredRule('Peso (kg)')} formControlType='text'/>
                                    <Form.Control.Feedback type='invalid' style={{fontSize: '0.8rem' , order:1}}>{errors.weightKg?.message}</Form.Control.Feedback>
                                </Form.Group>   
                                <Form.Group as={Col}>
                                    <Form.Label>Altura (m)</Form.Label>
                                    <HookControlledFormControl control={control} name='heightM' formControlType='text' rules={justRequiredRule('Altura (m)')} />
                                    <Form.Control.Feedback type='invalid'>{errors.heightM?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className='mt-5 d-flex justify-content-center align-items-start gx-5'>
                                <Form.Group as={Col} md='2'>
                                    <Form.Label>Data da medição</Form.Label>
                                    <Form.Control type='date' value={date} onChange={event => setDate(event.target.value)}/>
                                </Form.Group>
                                <Form.Group as={Col} md='2'>
                                    <Form.Label>Hora da medição</Form.Label>
                                    <Form.Control type='text' value={time} onChange={event => setTime(event.target.value)} />
                                </Form.Group>
                            </Row>
                    </Modal.Body>
                    <Modal.Footer className='bg-primary border-dark'>
                        <Button variant='danger' onClick={onClose} className='border-dark'>
                            Cancelar
                        </Button>
                        <Button variant='success' type='submit' className='border-dark'>
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <SaveErrorAlert show={showErrorAlert} onClose={handleCloseAlert} />
            <SaveSuccessAlert show={showSuccessAlert} onClose={() => setShowSuccessAlert(false)} />
        </Fragment>
    );
}