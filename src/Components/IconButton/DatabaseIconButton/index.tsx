import IconButton from "..";
import {ReactComponent as DatabaseIcon} from "assets/images/database-icon.svg";

type Props = {
    text : string;
}

const DatabaseIconButton = ({ text } : Props) => {
    return(
        <IconButton icon={<DatabaseIcon/>} text={text}/>
    );
}

export default DatabaseIconButton;