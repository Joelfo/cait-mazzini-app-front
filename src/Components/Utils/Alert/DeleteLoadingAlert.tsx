import { Alert, AlertProps, Container, Spinner } from "react-bootstrap";

export const DeleteLoadingAlert = ({ show } : AlertProps) => {
    
    return (
        <Container className='fixed-top'>
            <Alert
            show={show}
            variant='info'
            >
                <Alert.Heading>
                    <Spinner style={{marginRight: '15px'}} animation='border'/>
                    Apagando registro... Aguarde... 
                </Alert.Heading>
            </Alert>
        </Container>
    )
}