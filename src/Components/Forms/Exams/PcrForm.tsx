import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form";
import { PCRExam } from "Api/Types/PCRExam";
import { ExamFormProps } from "./ExamFormProps";
import { justRequiredRule } from "util/validation";

export const PcrForm = ({ patient, onSubmit, data } : ExamFormProps<PCRExam>) => {
  
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<PCRExam>({
        defaultValues: data ?? {
            patientId: patient.id
        }
    });

    return (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
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
                        name="isPositiveResult"
                        render={(
                            {
                                field: { onChange, onBlur, value }
                            }
                        ) => (
                            <Form.Check
                                label='Positivo'
                                checked={value}
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        )}
                    />
                </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md='4'>
                        <Form.Label>Método</Form.Label>
                        <Form.Control {...register('method', justRequiredRule('Método'))}/>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md='4'>
                        <Form.Label>Kit</Form.Label>
                        <Form.Control {...register('kit', justRequiredRule('Kit'))}/>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md='4'>
                        <Form.Label>Material</Form.Label>
                        <Form.Control {...register('material', justRequiredRule('Material'))}/>
                    </Form.Group>
                </Row>
                <Row>
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
            </Stack>
        </Form>
    )
}