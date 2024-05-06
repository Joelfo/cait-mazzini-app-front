import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form";
import { PPDExam } from "Api/Types/Exams/PPDExam";
import { justRequiredRule } from "util/validation";
import { ExamFormProps } from "./ExamFormProps";

export const PpdForm = ( { patient, onSubmit, data } : ExamFormProps<PPDExam>) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<PPDExam>({
        defaultValues: data ?? {
            patientId: patient.id
        }
    });

    return (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={3}>
            <Row>
                <Form.Group as={Col} md='6'>
                    <Form.Label>
                        Data
                    </Form.Label>
                    <Form.Control type='date' {...register('date', justRequiredRule('Data'))} isInvalid={!!errors.date} />
                    <Form.Control.Feedback type='invalid'>{errors.date?.message}</Form.Control.Feedback>
                </Form.Group>
                </Row>
                <Row>
                <Form.Group as={Col} className='d-flex align-items-center'>
                    <Controller 
                        control={control}
                        name="isReactiveResult"
                        render={(
                            {
                                field: { onChange, onBlur, value }
                            }
                        ) => (
                            <Form.Check
                                label='Reativo'
                                checked={value}
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        )}
                    />
                </Form.Group>
                </Row>
                <Row>
                <Form.Group as={Col} md='8'>
                    <Form.Label>Observações</Form.Label>
                    <Form.Control {...register('observations')}/>
                </Form.Group>
            </Row>            
            <Row className="form-mazzini-row">
                <Col md='2'>
                    <Button variant='success' type='submit'>
                        Salvar
                    </Button>
                </Col>
            </Row>
            </Stack>
        </Form>
    )
}