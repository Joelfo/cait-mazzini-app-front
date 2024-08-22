import { RichTextEditor } from 'Components/RichTextEditor';
import { useSelectedPatient } from 'Hooks/useSelectedPatient';
import { usePatientsStore } from 'Stores/UsePatientsStore';
import { Fragment, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { Patient } from 'Api/Types/Patient';
import { TrackingAppointmentChart } from 'Api/Types/TrackingAppointmentChart';
import { justRequiredRule, requiredTextMessage } from 'util/validation';
import './index.css';
import { registerForBootstrap } from 'util/HookFormBootstrapUtils';
import { HookControlledFormControl } from 'util/components/HookControlledFormControl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ETrackingAppointmentChartType } from 'Api/Types/enums/ETrackingAppointmentChartType';
import { getActualDate } from 'util/DateUtils';
import { useTrackingAppointmentChartApi } from 'Api/useTrackingAppointmentChartApi';
import { ConnectionErrorAlert } from 'Components/Utils/Alert/ConnectionErrorAlert';
import { useUserContext } from 'Contexts/useUserContext';
import { VitalSignsMeasurementsList } from 'Components/VitalSignsMeasurementList';

export const TrackingAppointmentChartForm = () => {
    const user = useUserContext();

    const {
        register,
        setValue : setFormValue,
        handleSubmit,
        watch,
        formState : { errors },
        setValue,
        control
    } = useForm<TrackingAppointmentChart>({
        defaultValues: {
            creatorId: user.id
        }
    });

    const { patient, isError: isPatientError } = useSelectedPatient();

    const urlParams = useSearchParams()[0]

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<TrackingAppointmentChart> = (data) => mutate(data);

    const [showVitalSignsMeasurementList, setShowVitalSignsMeasurementList] = useState(false);


    const quillModules = {
        toolbar: [
            [{ font: [] }, { size: [] }],
            [{ align: [] }, 'direction' ],
            [ 'bold', 'italic', 'underline', 'strike' ],
            [{ color: [] }, { background: [] }],
            [{ script: 'super' }, { script: 'sub' }],
            ['blockquote', 'code-block' ],
            [{ list: 'ordered' }, { list: 'bullet'}, { indent: '-1' }, { indent: '+1' }],
            [ 'link', 'image', 'video' ],
            [ 'clean' ]
        ],
    };

    const trackingAppointmentChartApi = useTrackingAppointmentChartApi();

    const { mutate, isLoading, status: creationStatus } = trackingAppointmentChartApi.useCreate();
    
    const [ showSubmittingError, setShowSubmittingError ] = useState<boolean>(false);

    useEffect(() => {
        const actualDate = getActualDate();

        setValue('date', actualDate);
    }, []);
                 
    useEffect(() => {
        const chartType = urlParams.get('type');
        if (!!chartType) {
            setValue('type', parseInt(chartType) as ETrackingAppointmentChartType);
        }
    }, [urlParams]);
               
    useEffect(() => {
        if (patient) {
            setValue('patientId', patient.id);
        }
    }, [patient]);

    useEffect(() => {
        if (creationStatus === 'success') {
            navigate(`/patient?patientId=${patient!.id}&savedData=true`);
        }
        else if (creationStatus === 'error') {
            setShowSubmittingError(true);
        }

    }, [creationStatus])

    return (
        <>
            
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Container fluid>
                    <Row className='d-flex justify-content-center'>
                        <Form.Group as={Col} md='3'>
                            <Form.Label>Profissional de saúde</Form.Label>
                            <Form.Control disabled value={user.name}/>
                        </Form.Group>
                        <Form.Group as={Col} md='3'>
                            <Form.Label>Nome do paciente</Form.Label>
                            <Form.Control type='text' disabled value={patient?.name}/>
                        </Form.Group>
                    </Row>
                    <Row className='mt-5 d-flex justify-content-center'>
                        <Form.Group as={Col} md='5'>
                            <Form.Label>
                                Data
                            </Form.Label>
                            <HookControlledFormControl control={control} name='date' rules={justRequiredRule('Data')} formControlType='date'/>
                            <Form.Control.Feedback type='invalid'>{errors.date?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mt-5 d-flex justify-content-center'>
                        <Form.Group as={Col} md='5'>
                            <Form.Label>Esquema</Form.Label>
                            <HookControlledFormControl control={control} name='schema' rules={justRequiredRule('Esquema')} formControlType='text' />
                            <Form.Control.Feedback type='invalid'>{errors.schema?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mt-5 d-flex justify-content-center'>
                        <Col md='2'>
                            <Button size='lg' onClick={() => setShowVitalSignsMeasurementList(true)}>
                                <i className='bi bi-bar-chart-fill' style={{fontSize: '20px', marginRight: '5px'}}></i>
                                Sinais vitais
                            </Button>
                        </Col>
                    </Row>
                    <Row className='mt-5'>
                        <Form.Group>
                            <Form.Label>Evolução / Queixas</Form.Label>
                            <Controller 
                                control={control}
                                name='evolution'
                                rules={justRequiredRule('Evolução / Queixas')}
                                render = {({
                                    field: {onChange, onBlur, value},
                                    fieldState: {invalid}
                                }) => (
                                <Fragment>
                                    <ReactQuill theme='snow' value={value} onBlur={onBlur} onChange={onChange} modules={quillModules}/>
                                    <Form.Control type='text' isInvalid={invalid} style={{display: 'none'}}/>
                                </Fragment>
                                )}
                            />
                            <Form.Control.Feedback type='invalid'>{errors.evolution?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mt-5'>
                        <Form.Group>
                            <Form.Label>Conduta</Form.Label>
                            <Controller 
                                control={control}
                                name='conduct'
                                rules={justRequiredRule('Conduta')}
                                render = {({
                                    field: {onChange, onBlur, value},
                                    fieldState: {invalid}
                                }) => (
                                <Fragment>
                                    <ReactQuill theme='snow' value={value} onBlur={onBlur} onChange={onChange} modules={quillModules}/>
                                    <Form.Control type='text' isInvalid={invalid} style={{display: 'none'}}/>
                                </Fragment>
                                )}
                            />
                            <Form.Control.Feedback type='invalid'>{errors.conduct?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mt-5'>
                        <Form.Control as={Col} md='12' style={{display:'flex', justifyContent:'center'}}>
                            <Form.Check
                                type='checkbox'
                                label='Assumo responsabilidade pelo envio dos dados'
                                isInvalid={!!errors.creatorId}
                            />
                            <Form.Control.Feedback type='invalid'>{errors.creatorId?.message}</Form.Control.Feedback>
                        </Form.Control>
                    </Row>
                    <Row className='mt-4'>
                        <Col md={12} style={{display:'flex', justifyContent:'center'}}>
                            <Button type='submit' variant='primary' size='lg' disabled={isPatientError}> 
                                {
                                    !isLoading ?
                                        <Fragment> Salvar ficha </Fragment>
                                        :
                                        <Fragment>
                                            <Spinner
                                                as='span'
                                                animation='border'
                                                role='status'
                                                size='sm'
                                                aria-hidden= 'true'
                                            />
                                            Carregando
                                        </Fragment>
                                        
                                }
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Form>
            <Alert 
            show={showSubmittingError} 
            onClose={() => setShowSubmittingError(false)}
            variant='danger' 
            dismissible 
            className='fixed-top'
            >
                <Alert.Heading> Erro ao salvar os dados. </Alert.Heading>
                <p>Por favor, verifique sua conexão à internet e tente novamente em alguns instantes. Se o erro persistir, por favor contacte-nos para resolver o problema.</p>
            </Alert>
            <ConnectionErrorAlert show={isPatientError} />
            <VitalSignsMeasurementsList show={showVitalSignsMeasurementList} onClose={() => setShowVitalSignsMeasurementList(false)}/>
        </>
    );
}