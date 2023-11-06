import { ReactNode } from "react"
import { Modal } from "react-bootstrap"
import { JsxElement } from "typescript"

export const MazziniPopup = ({ show, title, children } : MazziniPopupProps) => {
    return (
        <Modal show={show} dialogClassName="modal-60w border-dark shadow">
            <Modal.Header className='bg-primary border-dark'>
                <Modal.Title>{title}</Modal.Title>    
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
    children: ReactNode
}