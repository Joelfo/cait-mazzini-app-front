import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { ExamFormProps } from "./ExamFormProps";
import { BaarExam } from "Api/Types/Exams/BaarExam";
import { Controller, useForm } from "react-hook-form";
import { justRequiredRule } from "util/validation";
import { useMemo } from "react";
import IconButton from "Components/IconButton";
import { IconButton2 } from "Components/IconButton/IconButton2";
import { Formik } from "formik";
import FormRange from "react-bootstrap/esm/FormRange";
import { ComplementaryExamDTO } from "Api/Types/DTOs/ComplementaryExamDTO";
import { ESputumAspect } from "Api/Types/enums/ESputumAspect";
import { EBaarResult } from "Api/Types/enums/EBaarResult";

export const BaarForm = ({ patient, onSubmit, data } : ExamFormProps<BaarExam>) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register,
        watch
    } = useForm<ComplementaryExamDTO<BaarExam>>({
        defaultValues: data ?? {
            patientId: patient.id
        }
    });

    const isIsputumMaterial = watch('isSputumMaterial');

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
                    <Form.Group as={Col} md='5'>
                        <Form.Label>Mês</Form.Label>
                        <Form.Control  type='number' {...register('monthNumber', justRequiredRule('Mês'))}/>
                    </Form.Group>
                    
                    <Form.Group as={Col} md='5'>
                        <Form.Label>Amostra</Form.Label>
                        <Form.Control  type='number' {...register('sampleNumber', justRequiredRule('Amostra'))}/>
                    </Form.Group>
                </Row>
                <Row>
                    <Row>
                        <Form.Label>Material</Form.Label>
                    </Row>
                    <Row>
                        <Form.Group as={Col} md='4' >
                            <Controller
                                name="isSputumMaterial"
                                control={control}
                                render={({
                                    field: {onChange, onBlur, value},
                                }) => (
                                    <Form.Check label='Escarro' onChange={onChange} onBlur={onBlur} checked={value}/>
                                )}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='5'>
                            <Form.Label>Outro Material</Form.Label>
                            <Form.Control {...register('otherMaterial')}/>
                        </Form.Group>
                    </Row>
                </Row>
                {
                    isIsputumMaterial
                    &&
                    <Row>
                    
                        <Form.Group as={Col} md='6'>
                            <Form.Label>Aspecto do escarro</Form.Label>
                            <Controller
                                control={control}
                                name='sputumAspect'
                                render={({
                                    field: { onChange, onBlur, value }
                                }) => (
                                    <Form.Select onChange={onChange} value={value} onBlur={onBlur}>
                                        <option value={ESputumAspect.Spittle}>Saliva</option>
                                        <option value={ESputumAspect.Mucopurulent}>Mucopurulento</option>
                                        <option value={ESputumAspect.Purulent}>Purulento</option>
                                        <option value={ESputumAspect.Bloody}>Sanguinolento</option>
                                        <option value={ESputumAspect.Liquefied}>Liquefeito</option>
                                    </Form.Select>
                                )}
                            />
                        </Form.Group>
                    </Row>
                }

                <Row>
                    <Form.Group as={Col} md='6'>
                        <Form.Label>Resultado</Form.Label>
                        <Controller
                            control={control}
                            name='result'
                            render={({
                                field: { onChange, onBlur, value }
                            }) => (
                                <Form.Select onChange={onChange} value={value} onBlur={onBlur}>
                                    <option value={EBaarResult.Negative}>Negativo</option>
                                    <option value={EBaarResult.Positive}>Positivo</option>
                                    <option value={EBaarResult.PositivePlus}>Positivo <b>(+)</b></option>
                                    <option value={EBaarResult.PositiveDoublePlus}>Positivo <b>(++)</b></option>
                                    <option value={EBaarResult.PositiveTriplePlus}>Positivo <b>(+++)</b></option>
                                </Form.Select>
                            )}
                        />
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