import { Alert } from "react-bootstrap";

export interface ISaveSuccessAlertProps {
    show: boolean;
    onClose: () => void;
}

export const SaveSuccessAlert = ({ show, onClose } : ISaveSuccessAlertProps) => {
    return (
        <Alert
            show={show}
            onClose={onClose}
            variant='success'
            dismissible
            className='fixed-top'
        >
            <Alert.Heading>Dados salvos com sucesso.</Alert.Heading>
            <p>Os dados enviados foram cadastrados com sucesso.</p>
        </Alert>
    )
}