import { Button, Col, Container, Form, FormControlProps, Row, Stack } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form";
import { LoginDTO } from "Api/Types/DTOs/LoginDTO";
import ReactInputMask, { Props } from 'react-input-mask';
import { justRequiredRule } from "util/validation";
import { useAuthApi } from "Api/useAuthApi";
import { useAuthStore } from "Stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { LoadingAlert } from "Components/Utils/Alert/LoadingAlert";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { TimedAlert } from "Components/Utils/Alert/TimedAlert";
import CaitMazziniLogo from "../assets/images/cait-mazzini-logo.png"
export const LoginPage = () => {

    const [ showInvalidCredentialsAlert, setShowInvalidCredentialsAlert ] = useState(false);
    
    //custom hooks
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
        register
    } = useForm<LoginDTO>({
        defaultValues: {}
    });

    const navigate = useNavigate();

    const { useLogin } = useAuthApi();

    const { mutate: login, isLoading, error } = useLogin();

    const setJwtToken = useAuthStore(state => state.setJwt);

    const handleAuthenticate = (data: LoginDTO) => {
        login(data, {
            onSuccess: (token) => {
                setJwtToken(token);
                console.log(token);
                navigate('/home');
            }
        })
    };

    
    useEffect(() => {
        if (error instanceof AxiosError && error.response?.status === 400) {
            setShowInvalidCredentialsAlert(true);
        }
    }, [error]);

    return (
        <>
            <Container>
                    <Stack style={{height: '100vh', alignItems: 'center', justifyContent: 'center'}}>
                        <Stack gap={4} style={{justifyContent: 'center'}}>
                            <Stack style={{justifyContent: 'center'}} direction="horizontal">
                                <div style={{height: '250px', display: 'flex', justifyContent: 'center'}}>
                                    <img style={{borderRadius: '5px'}} src={CaitMazziniLogo} alt='Logo do Cait Mazzini Bueno'/>
                                </div>
                            </Stack>
                            <Stack style={{justifyContent: 'center'}} direction="horizontal">
                                <h3>Autenticação</h3>
                            </Stack>
                            <div>
                                <Form onSubmit={handleSubmit(handleAuthenticate)}>
                                    <Row className="form-mazzini-row justify-content-center">
                                        <Form.Group as={Col} md='4'>
                                            <Form.Label>CPF</Form.Label>
                                            <Controller
                                                control={control}
                                                name='cpf'
                                                rules={justRequiredRule('CPF')}
                                                render= {({
                                                    field: { onChange, onBlur, value, name, ref },
                                                    fieldState: { invalid, isTouched, isDirty, error },
                                                    formState,
                                                }) => (
                                                    <ReactInputMask mask='999.999.999-99' onChange={onChange} value={value} onBlur={onBlur}>
                                                        {((inputProps: Props & FormControlProps) => { return (<Form.Control {...inputProps} />)}) as any }
                                                    </ReactInputMask>
                                                )}
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                {errors.cpf?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className='form-mazzini-row justify-content-center'>
                                        <Form.Group as={Col} md='4'>
                                            <Form.Label>Senha</Form.Label>
                                            <Form.Control type='password' {...register('password', justRequiredRule('Senha'))} isInvalid={!!errors.password}/> 
                                        </Form.Group>
                                    </Row>
                                    <Row className='form-mazzini-row'>
                                        <Col className='d-flex justify-content-center'>
                                            <Button type='submit'>Autenticar</Button>   
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Stack>
                    </Stack>
            </Container>
            
            <LoadingAlert show={isLoading} text="Carregando... Por favor aguarde..."/>
            <TimedAlert variant="danger" onClose={() => setShowInvalidCredentialsAlert(false)} show={showInvalidCredentialsAlert}> 
                <p>Credenciais inválidas.</p>
            </TimedAlert>
        </>
    )
}