import { ReactComponent as PlusIcon } from "assets/images/plus-icon.svg";
import IconButton from "..";

export type AddButtonProps = {
    onClick: () => void
}

const AddButton = ({ onClick } : AddButtonProps) => {
    return <IconButton icon={<PlusIcon/>} text="Novo"/>
}

AddButton.defaultProps = {
    onClick: () => {}
};

export default AddButton;