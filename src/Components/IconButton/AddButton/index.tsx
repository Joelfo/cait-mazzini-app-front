import { ReactComponent as PlusIcon } from "assets/images/plus-icon.svg";
import IconButton from "..";

const AddButton = () => {
    return <IconButton icon={<PlusIcon/>} text="Novo"/>
}

export default AddButton;