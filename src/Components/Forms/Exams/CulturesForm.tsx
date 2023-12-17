import { CulturesExam } from "types/Api/Exams/CulturesExam";
import { ExamFormProps } from "./ExamFormProps";
import { Controller, useForm } from "react-hook-form";
import { Button, Col, Form, Row } from "react-bootstrap";
import { justRequiredRule } from "util/validation";

export const CulturesForm = ({patient, onSubmit, data} : ExamFormProps<CulturesExam>) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<CulturesExam>({
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
                <Form.Group as={Col} md='2'>
                    <Form.Label>
                        Sítio
                    </Form.Label>
                    <Form.Control {...register('site', justRequiredRule('Sítio'))} isInvalid={!!errors.site}/>
                    <Form.Control.Feedback type='invalid'>{errors.site?.message}</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className='form-mazzini-row'>
                <Form.Group as={Col} md='6'>
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