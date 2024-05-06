
import { Button, Col, Form, FormControlProps, Row, Stack } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form";
import InputMask, { Props } from 'react-input-mask';
import { User } from "Api/Types/User";
import { EUserRole } from "Api/Types/enums/EUserRole";
import { validateCpf } from "util/Validations";
import { justRequiredRule, requiredTextMessage } from "util/validation";

export type UserFormProps = {
    data?: User,
    onSubmit: (data: User) => void
}

export const UserForm = ({ data, onSubmit } :UserFormProps) => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        register
    } = useForm<User>({
        defaultValues: data ?? {
            role: EUserRole.Nurse
        }
    });
    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={5}>
                    <Stack gap={4}>
                        <Row>
                            <Form.Group as={Col} md='3'>
                                <Form.Label>Cpf</Form.Label>
                                <Controller
                                    control={control}
                                    name='cpf'
                                    rules={{
                                        required: {
                                            value: true,
                                            message: requiredTextMessage('CPF')
                                        },
                                        validate: {
                                            validCpf: value => validateCpf(!!value ? value.toString() : '') || 'Valor de Cpf inválido informado.' 
                                        }
                                    }}
                                    render={({
                                       field: { value, onChange, onBlur },
                                       fieldState: { invalid } 
                                    }) => (
                                        <><InputMask mask='999.999.999-99' onChange={onChange} value={value} onBlur={onBlur}>
                                            {
                                                ((inputProps: Props & FormControlProps) => 
                                                    { return <Form.Control {...inputProps} isInvalid={invalid}/> }) as any
                                            }
                                        </InputMask></>
                                    )}
                                />
                                <Form.Control.Feedback type='invalid'>{errors?.cpf?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='3'>
                                <Form.Label>Nome</Form.Label>
                                <Form.Control {...register('name', justRequiredRule('Nome'))} isInvalid={!!errors.name}/>
                                <Form.Control.Feedback type='invalid'>{errors?.name?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} md={3}>
                                <Form.Label>Email</Form.Label>
                                <Form.Control {...register('email', justRequiredRule('Email'))} isInvalid={!!errors.email}/>
                                <Form.Control.Feedback type='invalid'>{errors?.email?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md={3}>
                                <Form.Label>Senha</Form.Label>
                                <Form.Control {...register('password', justRequiredRule('Senha'))} isInvalid={!!errors.password} type='password' />
                                <Form.Control.Feedback type='invalid'>{errors?.password?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md={2}>
                                <Form.Label>Cargo</Form.Label>
                                <Controller
                                    name='role'
                                    rules={justRequiredRule('Cargo')}
                                    control={control}
                                    render={
                                        ({
                                            field: {onChange, onBlur, value},
                                            fieldState: {invalid}
                                        }) => (
                                            <Form.Select isInvalid={invalid} disabled={!!data} onChange={(event) => setValue('role', parseInt(event.target.value))} onBlur={onBlur} value={value}>
                                                <option value={EUserRole.Nurse} defaultChecked> Enfermeiro(a) </option>
                                                <option value={EUserRole.Physician}> Médico(a) </option>
                                                <option value={EUserRole.Pharmaceutical}> Farmacêutico(a) </option>
                                                <option value={EUserRole.Admin}> Administrador(a) </option>
                                            </Form.Select>
                                        )
                                    }
                                />
                                <Form.Control.Feedback type='invalid'>{errors?.role?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Stack>
                    <Stack>
                        <Row style={{justifyContent: 'center'}}>
                            <Form.Group as={Col} md='3'>
                                <Button type='submit'>
                                    Enviar cadastro
                                </Button>
                            </Form.Group>

                        </Row>
                    </Stack>
                </Stack>
            </Form>
        </>
    )
}