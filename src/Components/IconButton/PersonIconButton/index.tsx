import IconButton from "..";
import {ReactComponent as PersonIcon} from "assets/images/person-icon.svg";

type Props = {
    text : string;
}

const PersonIconButton = ({ text } : Props) => {
    return(
        <IconButton icon={<PersonIcon/>} text={text}/>
    );
}

export default PersonIconButton;