import AddButton from "Components/IconButton/AddButton";
import { ChartIconButton } from "Components/IconButton/ChartIconButton";
import { IconButton2 } from "Components/IconButton/IconButton2";
import { Spinner, Stack } from "react-bootstrap";
import { TrackingAppointmentChartBasicInfo } from "Api/Types/BasicInfo/TrackingAppointmentChartBasicInfo";
import { FirstAppointment } from "Api/Types/FirstAppointment";
import { TrackingAppointmentChart } from "Api/Types/TrackingAppointmentChart";

export type ChartsBarProps = {
    charts: TrackingAppointmentChartBasicInfo[],
    title: string,
    onClickNew: () => void,
    isLoading?: boolean,
    firstChart?: FirstAppointment,
    onClickOnChart: (chart: TrackingAppointmentChartBasicInfo) => void,
    canAddNew: boolean
};

export const ChartsBar = ({ charts, title, onClickNew, isLoading = false, onClickOnChart, canAddNew } : ChartsBarProps) => {

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
                                    onClick={() => onClickOnChart(chart)}
                                    date={chart.date}
                                    text='Acompanhamento'
                                    key={chart.id}
                                />
                            </div>
                        ))
                }
                {
                    canAddNew
                    &&
                    <div style={{padding: '0px 40px'}}>
                        <IconButton2 text="Novo" iconClass="bi-clipboard-plus" onClick={onClickNew}/>
                    </div>
                }
                
                
            </Stack>
        </Stack>

    )
}