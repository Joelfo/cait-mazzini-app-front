import IconButton from "..";
import {ReactComponent as FirstChartIcon} from "assets/images/first-chart-icon.svg";
import './index.css'

type Props = {
    text : string;
    date : string;
}

const PersonIconButton = ({ text, date } : Props) => {
    return(
        <div className="d-flex justify-content-center align-items-center flex-column">
            <IconButton icon={ <FirstChartIcon/> } text={ text }/>
            <p className="date-text">{date}</p>
        </div>
    );
}

export default PersonIconButton;