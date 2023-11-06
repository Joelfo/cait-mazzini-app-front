import { Alert, AlertProps, Container, Spinner } from "react-bootstrap";

export const LoadingAlert = ({ show } : AlertProps) => {
    
    return (
        <Container className='fixed-top'>
            <Alert
            show={show}
            variant='info'
            >
                <Alert.Heading>
                    <Spinner style={{marginRight: '15px'}} animation='border'/>
                    Carregando dados... Aguarde... 
                </Alert.Heading>
            </Alert>
        </Container>
    )
}