import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { ExamFormProps } from "./ExamFormProps";
import { BiopsyExam } from "Api/Types/Exams/BiopsyExam";
import { useForm } from "react-hook-form";
import { justRequiredRule } from "util/validation";
import { useMemo } from "react";
import IconButton from "Components/IconButton";
import { IconButton2 } from "Components/IconButton/IconButton2";
import { ComplementaryExamDTO } from "Api/Types/DTOs/ComplementaryExamDTO";

export const BiopsyForm = ({ patient, onSubmit, data } : ExamFormProps<BiopsyExam>) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<ComplementaryExamDTO<BiopsyExam>>({
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
                        <Form.Control type='date' {...register('date', justRequiredRule('Data'))}  isInvalid={!!errors.date} />
                        <Form.Control.Feedback type='invalid'>{errors.date?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md='6'>
                        <Form.Label>
                            Tecido Analisado
                        </Form.Label>
                        <Form.Control {...register('analyzedTissue', justRequiredRule('Tecido analisado'))}  isInvalid={!!errors.analyzedTissue}/>
                        <Form.Control.Feedback type='invalid'>{errors.analyzedTissue?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md='10'>
                        <Form.Label>
                           Resultado
                        </Form.Label>
                        <Form.Control {...register('result', justRequiredRule('Tecido analisado'))} isInvalid={!!errors.result}/>
                        <Form.Control.Feedback type='invalid'>{errors.result?.message}</Form.Control.Feedback>
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