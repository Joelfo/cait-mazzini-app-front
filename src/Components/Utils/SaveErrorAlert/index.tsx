import { Alert } from "react-bootstrap";

export interface ISaveErrorAlertProps {
    show: boolean;
    onClose: () => void;
}

export const SaveErrorAlert = ({show, onClose} : ISaveErrorAlertProps) => {
    return (
        <Alert 
            show={show} 
            onClose={onClose}
            variant='danger' 
            dismissible 
            className='fixed-top'
            >
                <Alert.Heading> Erro ao salvar os dados. </Alert.Heading>
                <p>Por favor, verifique sua conexão à internet e tente novamente em alguns instantes. Se o erro persistir, por favor contacte-nos para resolver o problema.</p>
        </Alert>
    )
}