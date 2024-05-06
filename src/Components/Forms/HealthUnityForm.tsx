import { MazziniPopup } from "Components/MazziniPopup/MazziniPopup";
import { Button, Form, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { HealthUnity } from "Api/Types/HealthUnity";
import { justRequiredRule } from "util/validation";

export const HealthUnityForm = ({ onSubmit } : Props) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<HealthUnity>({
    });


    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
                <Form.Group>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control {...register('name', justRequiredRule('Nome'))} isInvalid={!!errors.name}/>
                    <Form.Control.Feedback type='invalid'>{errors.name?.message}</Form.Control.Feedback>
                </Form.Group>
                <Button type='submit'>
                    Salvar
                </Button>
            </Stack>
        </Form>
    );
}

type Props = {
    onSubmit: (data: HealthUnity)=> void
}