import { ReactComponent as PlusIcon } from "assets/images/plus-icon.svg";
import IconButton from "..";

export type AddButtonProps = {
    onClick?: () => void,
    label?: string
}

const AddButton = ({ onClick = () => {}, label = 'Novo' } : AddButtonProps) => {
    return <IconButton icon={<PlusIcon/>} text={label}/>
}

export default AddButton;