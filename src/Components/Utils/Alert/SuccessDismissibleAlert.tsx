import { useEffect, useMemo, useState } from "react";
import { Alert, AlertProps, Container, Spinner } from "react-bootstrap";

export type SuccessDismissibleAlertProps = {
    showTrigger: boolean,
    text: string,
}

export const SuccessDismissibleAlert = ({ showTrigger, text } : SuccessDismissibleAlertProps) => {

    const [ showAlert, setShowAlert ] = useState<boolean>(false);

    const handleClose = () => setShowAlert(false);

    useEffect(() => {
        if (showTrigger) 
            setShowAlert(showTrigger);
    }, [showTrigger]);

    useEffect(() => {
        if (showAlert) {
            setTimeout(() => setShowAlert(false), 2000)
        }
    }, [showAlert]);
    
    return (
        <Container className='fixed-top'>
            <Alert
                show={showAlert}
                variant='success'
                dismissible
                onClose={handleClose}
            >
                <Alert.Heading>
                    {text}
                </Alert.Heading>
            </Alert>
        </Container>
    )
}