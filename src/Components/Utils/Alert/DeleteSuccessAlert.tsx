import { SuccessDismissibleAlert, SuccessDismissibleAlertProps } from "./SuccessDismissibleAlert";

export type DeleteSuccessAlertProps = {
    showTrigger: boolean
}

export const DeleteSuccessAlert = ({ showTrigger }: DeleteSuccessAlertProps) => (<SuccessDismissibleAlert showTrigger={showTrigger} text={'Apagando registro... Aguarde...'}/>);