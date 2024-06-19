import { PhysicalActivityAPI } from "Api/usePhysicalActivityApi";
import { SaveErrorAlert } from "Components/Utils/Alert/SaveErrorAlert";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { useEffect } from "react";
import { Button, Col, Container, Form, FormLabel, Row } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PhysicalExam } from "Api/Types/PhysicalExam";
import { ETrackingAppointmentChartType } from "Api/Types/enums/ETrackingAppointmentChartType";
import { getActualDate } from "util/DateUtils";
import { QUILL_DEFAULT_MODULES } from "util/QuillDefaultModules";
import { ResponsabilityCheckbox } from "util/ResponsabilityCheckbox";
import { HookControlledFormControl } from "util/components/HookControlledFormControl";
import { HookControlledReactQuill } from "util/components/HookControlledReactQuill";
import { justRequiredRule } from "util/validation";
import { useUserContext } from "Contexts/useUserContext";
import { ControlledReactQuill } from "Components/ControlledReactQuill";

export const PhysicalExamForm = ({ onSubmit, onReturn = () => {}, showReturnButton = false, defaultData, physicalExamType } : PhysicalExamFormProps) => {

    const { patient } = useSelectedPatient();

    const user = useUserContext();

    const formData = useForm<PhysicalExam>({
        defaultValues: defaultData ?? {
            date: getActualDate(),
            type: physicalExamType
        }
    });
    //const onSubmit = (data: PhysicalExam) => savePhysicalExam({...data});

    const navigate = useNavigate();

    useEffect(() => {
        if (patient) {
            formData.setValue('patientId', patient.id)
        }
    }, [patient])

    return (
        <>
            <Container fluid>
                <FormProvider {...formData}>
                <Form noValidate onSubmit={formData.handleSubmit(onSubmit)}>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='2'>
                            <Form.Label>
                                Data
                            </Form.Label>
                            <Form.Control {...formData.register('date', justRequiredRule('Data'))} type='date'/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <ControlledReactQuill label='Aspecto geral e emocional*' name='generalAspect' rules={justRequiredRule('Aspecto geral e emocional')} />
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <ControlledReactQuill label='Condições de higiene*' name='hygieneConditionsObs' rules={justRequiredRule('Condições de higiene')}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <ControlledReactQuill label='Cabeça' name='headObs' rules={{}}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <ControlledReactQuill label='Pescoço' name='neckObs' rules={{}}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <ControlledReactQuill label='Peitoral' name='chestObs' rules={{}}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <ControlledReactQuill label='Abdome' name='abdomenObs' rules={{}}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <ControlledReactQuill label='MMSS / MMII' name='mmssMmiiObs' rules={{}}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <ControlledReactQuill label='Gênito-Urinário' name='urinaryTrackObs' rules={{}}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <ControlledReactQuill label='Pele e mucosa' name='skinAndMucousObs' rules={{}}/>
                        </Form.Group>
                    </Row>
                    <ResponsabilityCheckbox fieldName="creatorId"/>
                    <Row className='form-mazzini-row justify-content-center gx-5'>
                        {
                            showReturnButton
                            &&
                            <Col md='1'>
                                <Button variant='danger' size='lg' onClick={onReturn}> Voltar </Button>
                            </Col>
                        }
                        <Col md='1'>
                            <Button type='submit' variant='primary' size='lg'> Salvar </Button>
                        </Col>
                    </Row>
                </Form>
                </FormProvider>
            </Container>
        </>
    );
};

export type PhysicalExamFormProps = {
    onSubmit: (data: PhysicalExam) => void,
    onReturn?: () => void,
    showReturnButton?: boolean,
    defaultData?: PhysicalExam,
    physicalExamType: ETrackingAppointmentChartType
}