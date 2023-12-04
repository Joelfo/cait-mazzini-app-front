import { Col, Container, Form, Row } from "react-bootstrap";
import { ExamFormProps } from "./ExamFormProps";
import { BiopsyExam } from "types/Api/Exams/BiopsyExam";
import { useForm } from "react-hook-form";
import { justRequiredRule } from "util/validation";

export const BiopsyForm = ({ patient, onSubmit } : ExamFormProps<BiopsyExam>) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<BiopsyExam>({
        defaultValues: {
            patientId: patient.id
        }
    });

    return (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Container fluid> 
                <Row>
                    <Form.Group as={Col} md='3'>
                        <Form.Label>
                            Data
                        </Form.Label>
                        <Form.Control type='date' {...register('date', justRequiredRule('Data'))}/>
                    </Form.Group>
                    <Form.Group as={Col} md='2'>
                        <Form.Label>
                            Tecido Analisado
                        </Form.Label>
                        <Form.Control {...register('analyzedTissue', justRequiredRule('Tecido analisado'))} isInvalid={!!errors.analyzedTissue}/>
                        <Form.Control.Feedback type='invalid'>{errors.analyzedTissue?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='3'>
                        <Form.Label>
                           Resultado
                        </Form.Label>
                        <Form.Control {...register('result', justRequiredRule('Tecido analisado'))} isInvalid={!!errors.result}/>
                        <Form.Control.Feedback type='invalid'>{errors.result?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='5'>
                        <Form.Label>Observações</Form.Label>
                    <Form.Control {...register('observations')}/>
                </Form.Group>
                </Row>
            </Container>
        </Form>
    )
}