import { Alert, Container, Spinner } from "react-bootstrap"

export const SaveLoadingAlert = ({ show } : SavingLoadingAlertProps) => {
    return (
        <Container className='fixed-top'>
            <Alert
            show={show}
            variant='info'
            >
                <Alert.Heading>
                    <Spinner style={{marginRight: '15px'}} animation='border'/>
                    Salvando dados... Aguarde 
                </Alert.Heading>
            </Alert>
        </Container>
    );

}

export type SavingLoadingAlertProps = {
    show: boolean
}