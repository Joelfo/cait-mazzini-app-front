import { ReactComponent as ChartIcon } from "assets/images/chart-icon.svg";
import IconButton from "..";
import PersonIconButton from "../PersonIconButton";
import { IconButton2 } from "../IconButton2";

type Props = {
    text: string,
    date: string,
    onClick?: () => void
}

export const ChartIconButton = ({ text, date, onClick = () => {} } : Props) => {
    return(
        <div style={{width: 'fit-content'}} className="d-flex justify-content-center align-items-center flex-column">
            <IconButton2 text={text} onClick={onClick} iconClass='bi-file-earmark-text'/>
            <p className="date-text">{date}</p>
        </div>
    )
}