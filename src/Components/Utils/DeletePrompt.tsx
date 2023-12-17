import { Button, Modal } from "react-bootstrap"

export type DeletePromptProps = {
    show: boolean,
    onConfirm: () => void,
    onCancel: () => void,
}

export const DeletePrompt = ({ show, onConfirm, onCancel } : DeletePromptProps) => {
    return (
        <Modal show={show}>
            <Modal.Header><h4>Deseja remover o registro?</h4></Modal.Header>
            <Modal.Footer> 
                <Button variant='danger' onClick={onCancel}>Cancelar </Button>
                <Button variant='primary' onClick={onConfirm}>Confirmar </Button>
            </Modal.Footer>
        </Modal>
    )
}