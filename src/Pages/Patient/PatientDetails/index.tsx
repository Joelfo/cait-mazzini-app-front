import { ChartIconButton } from "Components/IconButton/ChartIconButton";
import PersonIconButton from "Components/IconButton/PersonIconButton";
import "./index.css";
import { useEffect, useRef, useState } from "react";
import { API_URL } from "util/requests";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { LaravelPage } from "types/vendor/LaravelPage/LaravelPage";
import { TrackingAppointmentChart } from "types/Api/TrackingAppointmentChart";
import { TrackingAppointmentChartType } from "types/enums/TrackingAppointmentChartType";
import AddButton from "Components/IconButton/AddButton";
import { Patient } from "types/Api/Patient";
import { usePatientsStore } from "Stores/UsePatientsStore";
import { StatsIconButton } from "Components/IconButton/StatsIconButton";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { VitalSignsMeasurementsList } from "Components/VitalSignsMeasurementList";
import FirstChartIconButton from "Components/IconButton/FirstChartIconButton";
import DatabaseIconButton from "Components/IconButton/DatabaseIconButton";
import { TrackingAppointmentChartAPI } from "Api/TrackingAppointmentChartAPI";
import date from 'date-and-time'
import { TrackingAppointmentChartCarrousel } from "Components/TrackingAppointmentChart/TrackingAppointmentChartCarousel";
import { Stack } from "react-bootstrap";


export const PatientDetails = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const patient = useSelectedPatient();
    const setSelectedPatientId = usePatientsStore(state => state.setSelectedPatientId);
    
    
    const [ vitalSignsMeasurementPopupOpen, setVitalSignsMeasurementPopupOpen ] = useState<boolean>(false);

    const trackingAppointmentChartApi = new TrackingAppointmentChartAPI();

    const { data: nurseryTrackingAppointmentCharts } = trackingAppointmentChartApi.useAllBasicInfoByPatientAndType(patient?.id, TrackingAppointmentChartType.FromNursery);

    const [ selectedTrackingAppointmentChartId, setSelectedTrackingAppointmentChartId ] = useState<number>();

    useEffect(() => console.log(vitalSignsMeasurementPopupOpen), [vitalSignsMeasurementPopupOpen]);
    return (
        <>
            {
                patient
                &&
                <div className="container">
                <div className="row main-info-container mb-4 mt-5">
                    <div className="col-1 chart-container">
                        <PersonIconButton text={patient.name}/>
                    </div>
                    <div className="col-1 chart-container">
                        <Link to={"/patientInfo?patientId=" + patient.id} onClick={() => setSelectedPatientId(patient.id)}>
                            <DatabaseIconButton text="Dados cadastrais"/>
                        </Link>
                    </div>
                    <div className="col-1 chart-container">
                        <StatsIconButton onClick={() => setVitalSignsMeasurementPopupOpen(true)} text="Medições de sinais vitais"/>
                    </div>
                </div>
                <h5>Enfermeiro</h5>
                <div className="row charts-container nursery-charts-container">
                    <div className="chart-container col-1">
                        <FirstChartIconButton text="Primeira consulta" date="01/01/2020"/>
                    </div>

                    {
                        nurseryTrackingAppointmentCharts?.map(chart => (
                            <div className='chart-container col-1'>
                                <Stack onClick={() => setSelectedTrackingAppointmentChartId(chart.id)}>
                                    <ChartIconButton
                                        text="Ficha de acompanhamento"
                                        date={date.format(new Date(chart.date), 'DD/MM/YYYY')}
                                    />
                                </Stack>
                            </div>
                        ))
                    }
                   
                    <div className="chart-container col-1">
                        <Link to={`/TrackingAppointmentChart?patientId=${patient.id}&type=${TrackingAppointmentChartType.FromNursery}` }>
                        <AddButton></AddButton>
                        </Link>
                        
                    </div>
                </div>
                
                <h5>Médico</h5>
                <div className="row charts-container medical-charts-container">
                    <div className="chart-container col-1">
                            <FirstChartIconButton text="Primeira consulta" date="01/01/2020"/>
                    </div>

                   
                  
                    <div className="chart-container col-1">
                        <AddButton></AddButton>
                    </div>
                </div>
                <h5>Farmacêutico</h5>
                <div className="row charts-container farmacy-charts-container">
                 
                    <div className="chart-container col-1">
                        <AddButton></AddButton>
                    </div>
                </div>
            </div>
            }
            
            <VitalSignsMeasurementsList show={vitalSignsMeasurementPopupOpen} onClose={() => setVitalSignsMeasurementPopupOpen(false)}/>
            
            <TrackingAppointmentChartCarrousel chartIds={nurseryTrackingAppointmentCharts?.map(x => x.id) ?? []} defaultSelectedId={selectedTrackingAppointmentChartId} onClose={() => setSelectedTrackingAppointmentChartId(undefined)} />
        </>
    );
}