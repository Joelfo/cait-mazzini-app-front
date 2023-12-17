import { Alert, Container } from "react-bootstrap";

export interface ISaveSuccessAlertProps {
    show: boolean;
    onClose: () => void;
}

export const SaveSuccessAlert = ({ show, onClose } : ISaveSuccessAlertProps) => {
    return (
        <Container className='fixed-top'>
            <Alert
                show={show}
                onClose={onClose}
                variant='success'
                dismissible
            >
                <Alert.Heading>Dados salvos com sucesso.</Alert.Heading>
                <p>Os dados enviados foram cadastrados com sucesso.</p>
            </Alert>
        </Container>
    )
}