import { IconButton2 } from "Components/IconButton/IconButton2"
import { ReactNode } from "react"
import { Button, Modal, Stack } from "react-bootstrap"
import { JsxElement } from "typescript"

export const MazziniPopup = ({ show, title, children, onClose, width = '60%' } : MazziniPopupProps) => {
    return (
        <Modal  
        show={show} 
        dialogClassName="border-dark shadow"
        style={{
            width: width,
            maxWidth: 'none !important',
        }}
        >
            <Modal.Header className='bg-primary border-dark justify-content-between d-flex'>
                
                <Modal.Title>{title}</Modal.Title> 
                <Button variant='danger' onClick={onClose}>
                    <i className='bi bi-x-lg' style={{fontSize: 'auto'}}/>
                </Button>
                
                
            </Modal.Header>
            <Modal.Body className='bg-secondary'>
                {children}
            </Modal.Body>
            <Modal.Footer className='bg-primary border-dark'/>
        </Modal>
    )
}

export type MazziniPopupProps = {
    show: boolean,
    title?: string,
    children: ReactNode,
    onClose?: () => void,
    width?: string
}