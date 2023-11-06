import IconButton from ".."
import {ReactComponent as ClipboardHeartIcon} from 'assets/images/clipboard-heart-icon.svg';

export const LifeHabitsIconButton = ({ onClick } : Props) => {
    return <IconButton onClick={onClick} icon={<ClipboardHeartIcon/>} text='Hábitos de vida'/>
}

export type Props = {
    onClick?: () => void
}