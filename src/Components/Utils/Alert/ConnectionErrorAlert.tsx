import { Alert, Container } from "react-bootstrap"

export const ConnectionErrorAlert = ({ show } : ConnectionErrorAlertProps) => {
    return (
        <Container className="fixed-top">
            <Alert 
                show={show} 
                variant='danger'   
            >
                <Alert.Heading> Erro de conexão. </Alert.Heading>
                <p>Por favor, aguarde na página enquanto tentamos reestabelecer a conexão com o servidor.</p>
            </Alert>
        </Container>
    )
}

export type ConnectionErrorAlertProps = {
    show: boolean
}