import IconButton from "..";
import {ReactComponent as PersonIcon} from "assets/images/person-icon.svg";

type Props = {
    text : string;
    onClick?: () => void
}

const PersonIconButton = ({ text, onClick = () => {} } : Props) => {
    return(
        <IconButton icon={<PersonIcon/>} text={text} onClick={onClick}/>
    );
}

export default PersonIconButton;