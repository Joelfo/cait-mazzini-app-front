import { Button, Col, Form, Row } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form";
import { PPDExam } from "types/Api/Exams/PPDExam";
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
            <Row>
                <Form.Group as={Col} md='3'>
                    <Form.Label>
                        Data
                    </Form.Label>
                    <Form.Control type='date' {...register('date', justRequiredRule('Data'))} isInvalid={!!errors.date} />
                    <Form.Control.Feedback type='invalid'>{errors.date?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='2' className='d-flex align-items-center'>
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
                <Form.Group as={Col} md='5'>
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
        </Form>
    )
}