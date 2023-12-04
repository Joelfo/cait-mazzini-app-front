import { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, Modal, ModalBody, OverlayTrigger, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { VitalSignsMeasurement } from "types/Api/VitalSignsMeasurement";
import { HookControlledFormControl } from "util/components/HookControlledFormControl";
import { justRequiredRule, requiredTextMessage } from "util/validation";
import * as Api from 'Api/VitalSignsMeasurementAPI';
import './styles.css';
import { SaveErrorAlert } from "Components/Utils/Alert/SaveErrorAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import DateTimePicker from "react-datetime-picker";
import { SaveSuccessAlert } from "Components/Utils/Alert/SaveSuccessAlert";
import { getActualDate, getActualTime } from "util/DateUtils";
import * as yup from "yup";
import { useFormik } from "formik";
import { yupResolver } from "@hookform/resolvers/yup"
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";

export interface IVitalSignsMeasurementPopupProps {
    show: boolean,
    onClose: () => void,
    onSave: () => void,
}

export const VitalSignsMeasurementFormPopup = ({ show, onClose, onSave } : IVitalSignsMeasurementPopupProps) => {
    yup.setLocale({
        number: {
            min: 'O campo deve ser maior do que ${min}',
            positive: 'O campo informado deve ser um valor positivo',
            
        }
    })

    const schema : yup.ObjectSchema<VitalSignsMeasurement> = yup.object({
        id: yup.number().default(0).required(),
        mmhgPa: yup.string().required(requiredTextMessage('PA (mmhg)')).max(6),
        bpmFc: yup.number().typeError(requiredTextMessage('FC (bpm)')).required().positive(),
        irpmFr: yup.number().typeError(requiredTextMessage('FR (irpm)')).required().positive(),
        celsiusTax: yup.number().typeError(requiredTextMessage('Tax °C')).required().positive(),
        oxygenSaturationPercentage: yup.number().positive().typeError(requiredTextMessage('Saturação de O² (%)')).required(),
        kgWeight: yup.number().positive().typeError(requiredTextMessage('Peso (kg)')).required(),
        mHeight: yup.number().positive().typeError(requiredTextMessage('Altura (m)')).required(),
        measurementDateTime: yup.string().required(),
        patientId: yup.number().required()
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<VitalSignsMeasurement>({
        resolver: yupResolver(schema),
    });

    

    const { patient } = useSelectedPatient();

    const onSubmit = (data: VitalSignsMeasurement) => mutate(data);

    const vitalSignsMeasurementApi = new Api.VitalSignsMeasurementAPI();
    const { mutate, isLoading, isError, isSuccess } = vitalSignsMeasurementApi.useCreate();

    const [ showErrorAlert, setShowErrorAlert ] = useState<boolean>(false);
    const [ showSuccessAlert, setShowSuccessAlert ] = useState<boolean>(false);
    const handleCloseAlert = () => setShowErrorAlert(false);


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
        onSave();
    }, [isSuccess]);


    useEffect(() => {
        if (patient) {
            setValue('patientId', patient.id);
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
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body className='bg-secondary'>
                        
                            <Row className='d-flex justify-content-evenly align-items-start gx-5'>
                                <Form.Group as={Col}>
                                    <Form.Label>PA (mmHg)</Form.Label>
                                    <Form.Control 
                                        {...register('mmhgPa', justRequiredRule('PA'))}
                                        isInvalid={!!errors.mmhgPa}
                                        maxLength={6}
                                    />
                                    <Form.Control.Feedback 
                                    type='invalid'
                                    >
                                        {errors.mmhgPa?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>FC (bpm)</Form.Label>
                                    <Form.Control
                                        {...register('bpmFc')}
                                        isInvalid={!!errors.bpmFc}
                                        type='number'
                                    />
                                    <Form.Control.Feedback
                                        type='invalid'
                                    >
                                        {errors.bpmFc?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Fr (irpm)</Form.Label>
                                    <Form.Control
                                        {...register('irpmFr')}
                                        isInvalid={!!errors.irpmFr}
                                        type='number'
                                    />
                                    <Form.Control.Feedback type='invalid'>{errors.irpmFr?.message}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Tax °C</Form.Label>
                                    <Form.Control 
                                        {...register('celsiusTax')}
                                        isInvalid={!!errors.celsiusTax}
                                        type='number'
                                        step={0.01}
                                    />
                                    <Form.Control.Feedback type='invalid'>{errors.celsiusTax?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row offsetCol className='mt-5 d-flex justify-content-evenly align-items-start gx-5'>
                                <Form.Group as={Col}>
                                    <Form.Label>Saturação de O² (%)</Form.Label>
                                    <Form.Control
                                        type='number'
                                        step={0.01}
                                        {...register('oxygenSaturationPercentage')}
                                        isInvalid={!!errors.oxygenSaturationPercentage}
                                    />
                                    <Form.Control.Feedback type='invalid'>{errors.oxygenSaturationPercentage?.message}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Peso (kg)</Form.Label>
                                    <Form.Control
                                        {...register('kgWeight')}
                                        type='number'
                                        step={0.001}
                                        isInvalid={!!errors.kgWeight}
                                    />
                                    <Form.Control.Feedback type='invalid' style={{fontSize: '0.8rem' , order:1}}>{errors.kgWeight?.message}</Form.Control.Feedback>
                                </Form.Group>   
                                <Form.Group as={Col}>
                                    <Form.Label>Altura (m)</Form.Label>
                                    <Form.Control
                                        {...register('mHeight')}
                                        type='number'
                                        step={0.01}
                                        isInvalid={!!errors.mHeight}
                                    />
                                    <Form.Control.Feedback type='invalid'>{errors.mHeight?.message}</Form.Control.Feedback>
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
            <SaveErrorAlert show={showErrorAlert} />
            <SaveSuccessAlert show={showSuccessAlert} onClose={() => setShowSuccessAlert(false)} />
            <SaveLoadingAlert show={isLoading}/>
        </Fragment>
    );
}