import { FirstNurseryAppointmentChart } from "Api/Types/FirstNurseryAppointmentChart";
import { useFirstNurseryAppointmentApi } from "Api/useFirstNurseryAppointmentApi";
import { ControlledReactQuill } from "Components/ControlledReactQuill";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { useUserContext } from "Contexts/useUserContext";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { Fragment, useEffect } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { Controller, FormProvider, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { ResponsabilityCheckbox } from "util/ResponsabilityCheckbox";
import { justRequiredRule } from "util/validation";

export const FirstNurseryAppointmentForm = () => {
    const user = useUserContext();

    const { patient } = useSelectedPatient();

    const formData = useForm<FirstNurseryAppointmentChart>({
    });

    const firstNurseryAppointmentChartApi = useFirstNurseryAppointmentApi();
    
    const { mutate: save, isLoading } = firstNurseryAppointmentChartApi.useCreate();

    const creatorId = formData.watch('creatorId');

    const navigate = useNavigate();

    const onSubmit = (data: FirstNurseryAppointmentChart) => save(data, { onSuccess: () => navigate('/patient?patientId=' + patient?.id + '&savedData=true') });

    useEffect(() => {
        if (!!patient) {
            formData.setValue('patientId', patient.id);
        }
    }, [patient]);

    return (
            <Container>
                <FormProvider {...formData}>
                    <Form onSubmit={formData.handleSubmit(onSubmit)}>
                        <Stack gap={5}>
                            <Row className='justify-content-center'>
                                <Form.Group as={Col} md='8'>
                                    <ControlledReactQuill label='Queixas principais *' rules={justRequiredRule('Queixas principais')} name='mainIssues'/>
                                </Form.Group> 
                            </Row>
                            <Row className='justify-content-center'>
                                <Form.Group as={Col} md='8'>
                                    <ControlledReactQuill label='Medicamentos em uso' name='drugsInUse'/>
                                </Form.Group> 
                            </Row>
                            <Row className='justify-content-center'>
                                <Form.Group as={Col} md='8'>
                                    <ControlledReactQuill label='Diagnóstico de enfermagem*' rules={justRequiredRule('Diagnóstico de enfermagem')} name='nurseryDiagnostic'/>
                                </Form.Group> 
                            </Row>
                            <Row className='justify-content-center'>
                                <Form.Group as={Col} md='8'>
                                    <ControlledReactQuill label='Conduta*' rules={justRequiredRule('Conduta')} name='conduct'/>
                                </Form.Group> 
                            </Row>
                            <Row className='justify-content-center'>
                                <Form.Group as={Col} md='8'>
                                    <ControlledReactQuill label='Informação Complementar' name='complementaryInfo'/>
                                </Form.Group> 
                            </Row>
                            <Row className='justify-content-center'>
                                <ResponsabilityCheckbox fieldName="creatorId"/>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col md='2'>
                                    <Button type='submit' size="lg">Salvar</Button>
                                </Col>

                            </Row>
                        </Stack>
                    </Form>
                </FormProvider>
                <SaveLoadingAlert show={isLoading}/>
            </Container>
    );
}