import { ReactNode, useEffect, useState } from "react"
import { Alert, Container } from "react-bootstrap";

export type TimedAlertProps = {
    children?: ReactNode,
    variant: 'danger' | 'success' | 'info' | 'primary' | 'warning',
    msTimeout?: number,
    show: boolean,
    onClose: () => void,
}

export const TimedAlert = ({ children, variant, msTimeout = 2000, show, onClose } : TimedAlertProps) => {  

    useEffect(() => {
        if (show) {
            setTimeout(onClose, msTimeout);           
        }
    }, [show]);

    return (
        <Container className='fixed-top'>
            <Alert
                show={show}
                variant={variant}
                dismissible
                onClose={onClose}
            >
                <Alert.Heading>
                    {children}
                </Alert.Heading>
            </Alert>
        </Container>
    )

}