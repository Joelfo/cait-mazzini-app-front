import { RichTextEditor } from 'Components/RichTextEditor';
import { usePatient } from 'Hooks/usePatient';
import { usePatientsStore } from 'Stores/UsePatientsStore';
import { Fragment, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { Patient } from 'types/Patient';
import { TrackingAppointmentChart } from 'types/TrackingAppointmentChart';
import { justRequiredRule, requiredTextMessage } from 'util/validation';
import './index.css';
import { registerForBootstrap } from 'util/HookFormBootstrapUtils';
import { HookControlledFormControl } from 'util/components/HookControlledFormControl';
import * as Api from 'Api/TrackingAppointmentChatAPI';
import { useSearchParams } from 'react-router-dom';
import { TrackingAppointmentChartType } from 'types/enums/TrackingAppointmentChartType';
import { getActualDate } from 'util/DateUtils';

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

    const patient = usePatient();

    const urlParams = useSearchParams()[0]

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

    const { mutate, isLoading, isError } = Api.usePost();
    
    const [ showSubmittingError, setShowSubmittingError ] = useState<boolean>(false);

    useEffect(() => {
        const actualDate = getActualDate();
        setValue('date', actualDate);
    }, []);

    useEffect(() => {
        setShowSubmittingError(isError);
    }, [isError]);
                 
    useEffect(() => {
        const chartType = urlParams.get('type') as TrackingAppointmentChartType;
        if (!!chartType) {
            setValue('type', chartType);
        }
    }, [urlParams]);
               
    useEffect(() => {
        if (patient) {
            setValue('patient.id', patient.id);
        }
    }, [patient]);

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
                            <Button type='submit' variant='primary' size='lg'> 
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
            
        </>
    );
}