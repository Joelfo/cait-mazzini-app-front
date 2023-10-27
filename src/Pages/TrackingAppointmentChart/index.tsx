import { TrackingAppointmentChartForm } from "Components/TrackingAppointmentChart/TrackingAppointmentChartForm";
import { Container } from "react-bootstrap";
import "react-quill/dist/quill.snow.css";


export const TrackingAppointmentChart = () => {
    return (
        <>
        <Container className="pb-5">
            <TrackingAppointmentChartForm/>
        </Container>
        </>
    );
};