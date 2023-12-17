import AddButton from "Components/IconButton/AddButton";
import { ChartIconButton } from "Components/IconButton/ChartIconButton";
import { Spinner, Stack } from "react-bootstrap";
import { FirstAppointment } from "types/Api/FirstAppointment";
import { TrackingAppointmentChart } from "types/Api/TrackingAppointmentChart";

export type ChartsBarProps = {
    charts: TrackingAppointmentChart[],
    title: string,
    onClickNew: () => void,
    isLoading?: boolean,
    firstChart?: FirstAppointment
};

export const ChartsBar = ({ charts, title, onClickNew, isLoading = false } : ChartsBarProps) => {

    return (
        <Stack gap={1}>
            <h5 style={{paddingLeft: '10px'}}>{title}</h5>
            <Stack direction="horizontal" style={{border: '2px solid #3D9AD5', marginBottom: '30px', display:'flex', alignItems: 'start', padding: '20px 0', overflowX: 'auto'}}>
                
                {
                    isLoading ? 
                        <div style={{height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
                            <Spinner variant="primary" style={{height: '50px', width: '50px'}}/>
                        </div>
                        :
                        charts.map(chart => (
                            <div style={{width: 'fit-content', padding: '0px 40px'}}>
                                <ChartIconButton
                                    onClick={onClickNew}
                                    date={chart.date}
                                    text='Acompanhamento'
                                    key={chart.id}
                                />
                            </div>
                        ))
                }
                <div style={{padding: '0px 40px'}}>
                    <AddButton
                        label='Novo'
                    />
                </div>
                
                
            </Stack>
        </Stack>

    )
}