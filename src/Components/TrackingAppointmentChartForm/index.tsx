import { usePatientsStore } from "Stores/UsePatientsStore";
import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Patient } from "types/Patient";
import { TrackingAppointmentChart } from "types/TrackingAppointmentChart";
import { requiredText } from "util/validation";
import * as yup from "yup";

export const TrackingAppointmentChartForm = () => {
    const {
        register,
        setValue : setFormValue,
        handleSubmit,
        watch,
        formState : { errors },
    } = useForm<TrackingAppointmentChart>();

    const [isFormValidated, setIsFormValidated] = useState<boolean>(false);

    const patient = usePatientsStore(state => state.selectedPatient);

    const onSubmit = () => {}

    return (
        <>
            
            <Form noValidate validated={isFormValidated} onSubmit={handleSubmit(onSubmit)}>
                <Container fluid>
                    <Row>
                        <Form.Group as={Col} md="5">
                            <Form.Label>Nome do paciente</Form.Label>
                            <Form.Control type="text" disabled value={patient?.name}/>
                        </Form.Group>
                        <Form.Group as={Col} md="5">
                            <Form.Label>Nome do médico</Form.Label>
                            <Form.Control type="text" disabled value={"Teste"}/>
                        </Form.Group>
                    </Row>
                    <Row className="d-flex justify-content-center">
                        <Form.Group as={Col} md="5">
                            <Form.Label>Esquema</Form.Label>
                            <Form.Control type="text" isValid={!Boolean(errors.schema)} {...register("schema", { required: { value: true, message: requiredText("Esquema") }})}/>
                            <Form.Control.Feedback type="invalid">{errors.schema?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </Container>
            </Form>
            
            
        </>
    );
}