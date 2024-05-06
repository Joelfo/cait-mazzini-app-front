import { MazziniPopup } from "Components/MazziniPopup/MazziniPopup";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { PhysicalActivity } from "Api/Types/PhysicalActivity";
import { justRequiredRule } from "util/validation";

export const PhysicalActivityForm = ({ onSubmit } : Props) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<PhysicalActivity>({
    });


    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction='horizontal' >
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control {...register('name', justRequiredRule('Nome'))} isInvalid={!!errors.name}/>
                        <Form.Control.Feedback type='invalid'>{errors.name?.message}</Form.Control.Feedback>
                    </Form.Group>
                
                    <Form.Group className='d-flex align-items-end' as={Col}>
                        <Button type='submit' >
                            Salvar
                        </Button>
                    </Form.Group>
                </Row>
            </Stack>
        </Form>
    );
}

type Props = {
    onSubmit: (data: PhysicalActivity)=> void
}