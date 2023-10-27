import { Stack } from "react-bootstrap"

export type RightMovingArrowProps = {
    onClick: () => void,
    show: boolean,
}

export const RightMovingArrow = ({ onClick, show } : RightMovingArrowProps) => {
    return (
        <Stack
            style={{
                display: show ? 'block' : 'none'
            }}
            onClick={onClick}
            className='arrow-container right-arrow-container'
        >
            <i style={{fontSize: '80px'}} className='bi bi-arrow-right-circle'></i>
        </Stack>  
    )
}