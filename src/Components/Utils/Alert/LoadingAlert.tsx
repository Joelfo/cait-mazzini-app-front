import { Alert, AlertProps, Container, Spinner } from "react-bootstrap";

export const LoadingAlert = ({ show, text = 'Carregando dados... Por favor aguarde...'} : LoadingAlertProps) => {
    
    return (
        <Container className='fixed-top'>
            <Alert
            show={show}
            variant='info'
            >
                <Alert.Heading>
                    <Spinner style={{marginRight: '15px'}} animation='border'/>
                    {text}
                </Alert.Heading>
            </Alert>
        </Container>
    )
}

export type LoadingAlertProps = {
    show: boolean,
    text?: string,
}