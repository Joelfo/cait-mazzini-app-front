import { Col, Container, Row, Stack } from "react-bootstrap";
import '../styles.css';

export type LeftMovingArrowProps = {
    onClick: () => void,
    show: boolean
}

export const LeftMovingArrow = ({ onClick, show } : LeftMovingArrowProps) => {
    return (
        <Stack
            style={{
                display: show ? 'block' : 'none',
            }} 
            onClick={onClick}
            className='arrow-container left-arrow-container'
        >
            <i style={{fontSize: '80px'}} className="bi bi-arrow-left-circle"></i>
        </Stack>  
    )
}