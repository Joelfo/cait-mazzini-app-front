import { CulturesExam } from "types/Api/Exams/CulturesExam";
import { ExamFormProps } from "./ExamFormProps";
import { Controller, useForm } from "react-hook-form";
import { Col, Form, Row } from "react-bootstrap";
import { justRequiredRule } from "util/validation";

export const CulturesForm = ({patient, onSubmit} : ExamFormProps<CulturesExam>) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<CulturesExam>({
        defaultValues: {
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
                    <Form.Control type='date' {...register('date', justRequiredRule('Data'))}/>
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
                                onSelect={onChange}
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
                <Form.Group as={Col} md='5'>
                    <Form.Label>Observações</Form.Label>
                    <Form.Control {...register('observations')}/>
                </Form.Group>
            </Row>
        </Form>
    )
}