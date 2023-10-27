import { LeftMovingArrow } from "./LeftMovingArrow"
import { RightMovingArrow } from "./RightMovingArrow"

export type DoubleMovingArrowsProps = {
    onClickLeft: () => void,
    onClickRight: () => void,
    showLeft: boolean,
    showRight: boolean
}

export const DoubleMovingArrows = ({ showLeft, showRight, onClickLeft, onClickRight } : DoubleMovingArrowsProps) => {
    return (
        <>
            <LeftMovingArrow show={showLeft} onClick={onClickLeft}/>
            <RightMovingArrow show={showRight} onClick={onClickRight}/>
        </>
    )
}
