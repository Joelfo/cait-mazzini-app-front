import { ReactComponent as ChartIcon } from "assets/images/chart-icon.svg";
import IconButton from "..";
import PersonIconButton from "../PersonIconButton";

type Props = {
    text: string,
    date: string
}

export const ChartIconButton = ({ text, date } : Props) => {
    return(
        <div className="d-flex justify-content-center align-items-center flex-column">
            <IconButton icon={ <ChartIcon/> } text={ text }/>
            <p className="date-text">{date}</p>
        </div>
    )
}