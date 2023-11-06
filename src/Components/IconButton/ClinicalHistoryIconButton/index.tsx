import IconButton from "..";
import { DefaultIconButtonProps } from "../DefaultIconButtonProps";
import {ReactComponent as Icon} from "assets/images/clipboard-pulse-icon.svg";

export const ClinicalHistoryIconButton = ({ onClick, label = 'Histórico clínico e cirúrgico' } : DefaultIconButtonProps) => {
    return (
        <IconButton text={label} icon={<Icon/>} onClick={onClick}/>
    )
}
