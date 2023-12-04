import { Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { HealthUnity } from "types/Api/HealthUnity";
import { justRequiredRule } from "util/validation";

export const HealthUnityForm = () => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<HealthUnity>({
    });

    return (
        
            <Form>
                <Container fluid>
                    <Row>
                        <Form.Group as={Col} md='2'>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                {...register('name', justRequiredRule('Nome'))}
                            />
                            <Form.Control.Feedback type='invalid'>{errors.name?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                        </Form.Group>
                    </Row>
                </Container>
            </Form>
    )
}