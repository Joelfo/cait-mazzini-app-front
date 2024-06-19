import { Button, Col, Form, FormControl, Row, Stack } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form";
import { PCRExam } from "Api/Types/PCRExam";
import { ExamFormProps } from "./ExamFormProps";
import { justRequiredRule, requiredTextMessage } from "util/validation";
import { IgraExam } from "Api/Types/IgraExam";
import { OtherExam } from "Api/Types/Exams/OtherExam";
import { ComplementaryExamDTO } from "Api/Types/DTOs/ComplementaryExamDTO";


export const OtherExamForm = ({ data, patient, onSubmit } : ExamFormProps<OtherExam>) => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<ComplementaryExamDTO<OtherExam>>({
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
                <Form.Group as={Col} md='5'>
                    <Form.Label>
                        Nome do exame
                    </Form.Label>
                    <Form.Control {...register('name', justRequiredRule('Nome do exame'))} isInvalid={!!errors.name}/>
                    <Form.Control.Feedback type='invalid'>{requiredTextMessage('Nome do exame')}</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} md='5'>
                    <Form.Label>Observações</Form.Label>
                    <Form.Control {...register('observations')}/>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} md='12'>
                    <Form.Label>Arquivos</Form.Label>
                    <Form.Control {...register('files')} type='file'  multiple/>
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