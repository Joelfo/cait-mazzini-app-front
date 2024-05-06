import { PatientInfoFields } from "Components/PatientInfoFields";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { ToraxXRayExam } from "Api/Types/Exams/ToraxXRayExam";
import { Patient } from "Api/Types/Patient";
import { EToraxXRayResult } from "Api/Types/enums/EToraxXRayResult";
import { justRequiredRule } from "util/validation";
import { ExamFormProps } from "./ExamFormProps";
import { ComplementaryExamDTO } from "Api/Types/DTOs/ComplementaryExamDTO";



export const ToraxXRayForm = ({ onSubmit, patient, data } : ExamFormProps<ToraxXRayExam>) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<ComplementaryExamDTO<ToraxXRayExam>>({
        defaultValues: data ?? {
            patientId: patient.id,
            xRayResult: EToraxXRayResult.Common,
            examFiles: []
        }
    });

    const handleResultChange : React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        setValue('xRayResult', parseInt(event.target.value));
    }

    return (
        <>
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
                    <Form.Group as={Col} md='4'>
                        <Form.Label>
                            Resultado
                        </Form.Label>
                        <Controller
                            control={control}
                            name='xRayResult'
                            rules={justRequiredRule('Resultado')}
                            render={(
                                {
                                    field: { onBlur, value},
                                    fieldState: { invalid },
                                }
                            ) => (
                                <Form.Select isInvalid={invalid} value={value} onBlur={onBlur} onChange={handleResultChange}>
                                    <option value={EToraxXRayResult.Common}>Normal</option>
                                    <option value={EToraxXRayResult.HasSequelae}>SEQ.</option>
                                    <option value={EToraxXRayResult.HasSug}> SUG </option>
                                    <option value={EToraxXRayResult.HasOthers}>Outros</option>
                                </Form.Select> 
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
        </>
    );
}