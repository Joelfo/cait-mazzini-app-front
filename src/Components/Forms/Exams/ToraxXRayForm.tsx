import { PatientInfoFields } from "Components/PatientInfoFields";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { ToraxXRayExam } from "types/Api/Exams/ToraxXRayExam";
import { Patient } from "types/Api/Patient";
import { EToraxXRayResult } from "types/enums/EToraxXRayResult";
import { justRequiredRule } from "util/validation";

export type ToraxXRayFormProps = {
    onSubmit: (data: ToraxXRayExam) => void,
    patient: Patient
}

export const ToraxXRayForm = ({ onSubmit, patient } : ToraxXRayFormProps) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<ToraxXRayExam>({
        defaultValues: {
            patientId: patient.id
        }
    });

    const handleResultChange : React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        setValue('xRayResult', parseInt(event.target.value));
    }

    return (
        <>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <PatientInfoFields patient={patient} />
                <Row className='form-mazzini-row'>
                    <Form.Group as={Col} md='3'>
                        <Form.Label>
                            Data
                        </Form.Label>
                        <Form.Control type='date' {...register('date', justRequiredRule('Data'))}/>
                    </Form.Group>
                    <Form.Group as={Col} md='2'>
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
                    <Form.Group as={Col} md='4'>
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
        </>
    );
}