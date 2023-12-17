import { RichTextEditor } from 'Components/RichTextEditor';
import { useSelectedPatient } from 'Hooks/useSelectedPatient';
import { usePatientsStore } from 'Stores/UsePatientsStore';
import { Fragment, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { Patient } from 'types/Api/Patient';
import { TrackingAppointmentChart } from 'types/Api/TrackingAppointmentChart';
import { justRequiredRule, requiredTextMessage } from 'util/validation';
import './index.css';
import { registerForBootstrap } from 'util/HookFormBootstrapUtils';
import { HookControlledFormControl } from 'util/components/HookControlledFormControl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ETrackingAppointmentChartType } from 'types/enums/ETrackingAppointmentChartType';
import { getActualDate } from 'util/DateUtils';
import { TrackingAppointmentChartAPI } from 'Api/TrackingAppointmentChartAPI';
import { ConnectionErrorAlert } from 'Components/Utils/Alert/ConnectionErrorAlert';

export const TrackingAppointmentChartForm = () => {
    const {
        register,
        setValue : setFormValue,
        handleSubmit,
        watch,
        formState : { errors },
        setValue,
        control
    } = useForm<TrackingAppointmentChart>();

    const [isFormValidated, setIsFormValidated] = useState<boolean>(false);

    const { patient, isError: isPatientError } = useSelectedPatient();

    const urlParams = useSearchParams()[0]

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<TrackingAppointmentChart> = (data) => mutate(data);


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

    const trackingAppointmentChartApi = new TrackingAppointmentChartAPI();

    const { mutate, isLoading, status: creationStatus } = trackingAppointmentChartApi.useCreate();
    
    const [ showSubmittingError, setShowSubmittingError ] = useState<boolean>(false);

    useEffect(() => {
        const actualDate = getActualDate();

        setValue('date', actualDate);
    }, []);
                 
    useEffect(() => {
        const chartType = urlParams.get('type');
        if (!!chartType) {
            setValue('type', parseInt(chartType) as TrackingAppointmentChartType);
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
                    <Row>
                        <Form.Group as={Col} md='6'>
                            <Form.Label>Nome do paciente</Form.Label>
                            <Form.Control type='text' disabled value={patient?.name}/>
                        </Form.Group>
                        <Form.Group as={Col} md=''>
                            <Form.Label>Nome do médico</Form.Label>
                            <Form.Control type='text' disabled value={'Teste'}/>
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
                        <Col md={12} style={{display:'flex', justifyContent:'center'}}>
                            <Form.Check
                                type='checkbox'
                                label='Assumo responsabilidade pelo envio dos dados'
                            />
                        </Col>
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
            
        </>
    );
}