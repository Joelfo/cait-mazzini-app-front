import {ReactComponent as StatsIcon} from 'assets/images/stats-icon.svg';
import IconButton from '..';

export interface IStatsIconButtonProps {
    text : string;
    onClick: () => void;
}

export const StatsIconButton = ({ text, onClick } : IStatsIconButtonProps) => {
    return (
        <IconButton icon={<StatsIcon/>} onClick={onClick} text={text}/>
    )
}