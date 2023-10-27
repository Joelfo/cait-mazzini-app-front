import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FirstAppointment } from "types/Api/FirstAppointment";
import { FirstNurseryAppointment } from "types/Api/FirstNurseryAppointment";
import { QUILL_DEFAULT_MODULES } from "util/QuillDefaultModules";
import { ResponsabilityCheckbox } from "util/ResponsabilityCheckbox";
import { HookControlledReactQuill } from "util/components/HookControlledReactQuill";

export const FirsNurseryAppointmentEndingForm = ({ firstAppointmentData, defaultData, onSubmit, onReturn } : FirstNurseryApointmentEndingFormProps) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
        register
    } = useForm<FirstNurseryAppointment>({
        defaultValues: defaultData ?? {...firstAppointmentData}
    });
    
    return (
        <>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Form.Group as={Col} md='10'>
                        <Form.Label>
                            Informações complementares
                        </Form.Label>
                        <HookControlledReactQuill
                            control={control}
                            name='complementaryInfo'
                            rules={{}}
                            modules={QUILL_DEFAULT_MODULES}
                        />
                    </Form.Group>
                </Row>
                <Row className="form-mazzini-row">
                    <Form.Group as={Col} md='10'>
                        <Form.Label>
                            Diagnóstico de enfermagem*
                        </Form.Label>
                        <HookControlledReactQuill
                            control={control}
                            name='nurseryDiagnosis'
                            rules={{}}
                            modules={QUILL_DEFAULT_MODULES}
                        />
                    </Form.Group>
                </Row>
                <Row className="form-mazzini-row">
                    <Form.Group as={Col} md='10'>
                        <Form.Label>
                            Conduta de enfermagem*
                        </Form.Label>
                        <HookControlledReactQuill
                            control={control}
                            name='nurseryConduct'
                            rules={{}}
                            modules={QUILL_DEFAULT_MODULES}
                        />
                    </Form.Group>
                </Row>
                <ResponsabilityCheckbox/>
                <Row className='form-mazzini-row justify-content-center gx-5'>
                        {
                            !!onReturn
                            &&
                            <Col md='1'>
                                <Button variant='danger' size='lg' onClick={onReturn}> Voltar </Button>
                            </Col>
                        }
                        <Col md='1'>
                            <Button type='submit' variant='primary' size='lg'> Próximo </Button>
                        </Col>
                        
                    </Row>
            </Form>
        </>
    );
}

export type FirstNurseryApointmentEndingFormProps = {
    firstAppointmentData: FirstAppointment,
    defaultData?: FirstNurseryAppointment,
    onSubmit: (data: FirstNurseryAppointment) => void,
    onReturn?: () => void
}