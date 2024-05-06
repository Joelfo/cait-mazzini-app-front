import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { FirstAppointment } from "Api/Types/FirstAppointment";
import { QUILL_DEFAULT_MODULES } from "util/QuillDefaultModules";
import { ResponsabilityCheckbox } from "util/ResponsabilityCheckbox";
import { HookControlledReactQuill } from "util/components/HookControlledReactQuill";
import { justRequiredRule } from "util/validation";

export const FirstAppointmentForm = ({ onSubmit, onReturn = () => {}, defaultData } : FirstAppointmentFormProps) => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
        register
    } = useForm<FirstAppointment>({
        defaultValues: defaultData ?? {}
    });

    const patient = useSelectedPatient();

    useEffect(() => {
        if (!!patient) {
            setValue('patientId', patient.id);
        }
    }, [patient]);

    return (
        <>
            <Container>
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Row>
                        <Form.Group as={Col} md='10'>
                            <Form.Label>
                                Queixas principais
                            </Form.Label>
                            <HookControlledReactQuill 
                                control={control} 
                                name='mainIssues' 
                                rules={justRequiredRule('Queixas principais')} 
                                modules={QUILL_DEFAULT_MODULES} 
                            />
                            <Form.Control.Feedback type='invalid'>{errors.mainIssues?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} md='10'>
                            <Form.Label>
                                Medicamentos em uso
                            </Form.Label>
                            <HookControlledReactQuill 
                                control={control} 
                                name='drugsInUse' 
                                rules={justRequiredRule('Medicamentos em uso')} 
                                modules={QUILL_DEFAULT_MODULES} 
                            />
                            <Form.Control.Feedback type='invalid'>{errors.drugsInUse?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <ResponsabilityCheckbox/>
                    <Row className='form-mazzini-row justify-content-center gx-5'>
                        {
                            !!onReturn
                            &&
                            <Col md='1'>
                                <Button variant='danger' size='lg'> Voltar </Button>
                            </Col>
                        }
                        <Col md='1'>
                            <Button type='submit' variant='primary' size='lg'> Próximo </Button>
                        </Col>
                        
                    </Row>
                </Form>
            </Container>
        </>
    )
}

export type FirstAppointmentFormProps = {
    onSubmit: (data: FirstAppointment) => void,
    onReturn?: () => void,
    defaultData?: FirstAppointment
}