import { MazziniPopup } from "Components/MazziniPopup/MazziniPopup";
import { Button, Form, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { City } from "Api/Types/City";
import { justRequiredRule } from "util/validation";

export const CityForm = ({ onSubmit } : Props) => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<City>({
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
    onSubmit: (data: City)=> void
}