import { Col, Form, Row } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form";
import { PCRExam } from "types/Api/PCRExam";
import { ExamFormProps } from "./ExamFormProps";
import { justRequiredRule } from "util/validation";

export const PcrForm = ({ patient, onSubmit } : ExamFormProps<PCRExam>) => {
  
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<PCRExam>({
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
                <Form.Group as={Col} md='5'>
                    <Form.Label>Observações</Form.Label>
                    <Form.Control {...register('observations')}/>
                </Form.Group>
            </Row>
        </Form>
    )
}