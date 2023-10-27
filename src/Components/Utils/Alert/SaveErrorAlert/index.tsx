import { Alert, Container } from "react-bootstrap";

export interface ISaveErrorAlertProps {
    show: boolean;
}

export const SaveErrorAlert = ({ show } : ISaveErrorAlertProps) => {
    return (
        <Container className="fixed-top">
            <Alert 
                show={show} 
                variant='danger'   
            >
                <Alert.Heading> Erro ao salvar os dados. </Alert.Heading>
                <p>Por favor, verifique sua conexão à internet e tente novamente em alguns instantes. Se o erro persistir, por favor contacte-nos para resolver o problema.</p>
            </Alert>
        </Container>
        
    )
}