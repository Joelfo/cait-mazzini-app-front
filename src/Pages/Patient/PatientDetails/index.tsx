import { ChartIconButton } from "Components/IconButton/ChartIconButton";
import PersonIconButton from "Components/IconButton/PersonIconButton";
import "./index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { API_URL } from "util/requests";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import { Spinner, Stack } from "react-bootstrap";
import { FirstNurseryAppointmentAPI } from "Api/FirstNurseryAppointmentAPI";
import { LifeHabitsIconButton } from "Components/IconButton/LifeHabitsIcon";
import { ClinicalHistoryIconButton } from "Components/IconButton/ClinicalHistoryIconButton";
import { LoadingAlert } from "Components/Utils/Alert/LoadingAlert";
import { IconButton2 } from "Components/IconButton/IconButton2";


export const PatientDetails = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { patient, isLoading: isPatientLoading } = useSelectedPatient();
    const setSelectedPatientId = usePatientsStore(state => state.setSelectedPatientId);

    useEffect(() => console.log(patient), [patient]);
    
    
    const [ vitalSignsMeasurementPopupOpen, setVitalSignsMeasurementPopupOpen ] = useState<boolean>(false);

    const trackingAppointmentChartApi = new TrackingAppointmentChartAPI();
    const firstNurseryAppointmentAPI = new FirstNurseryAppointmentAPI();

    //const { data: nurseryTrackingAppointmentCharts } = trackingAppointmentChartApi.useAllBasicInfoByPatientAndType(patient?.id, TrackingAppointmentChartType.FromNursery);

    const [ selectedTrackingAppointmentChartId, setSelectedTrackingAppointmentChartId ] = useState<number>();

    const { data: firstNurseryAppointment, isLoading: isFirstNurseryAppointmentLoading } = firstNurseryAppointmentAPI.useGetByPatient(patient?.id);

    const navigate = useNavigate();

    const handleLifeHabitsButton = useCallback(() => navigate('/lifeHabits/view?patientId=' + patient?.id), [patient, navigate])

    const handleClinicalHistoryButton = useCallback(() => navigate('/clinicalHistory/view?patientId=' + patient?.id), [patient, navigate]);

    const handleExamsButton = useCallback(() => navigate('/exams?patientId' + patient?.id), [navigate, patient]);
    return (
        <>
            <LoadingAlert show={isPatientLoading}/>
            {
                patient
                &&
                <div className="container">
                <div className="row main-info-container mb-4 mt-5">
                    <div className="col-1 chart-container">
                        <PersonIconButton text={patient.name}/>
                    </div>
                    <div className="col-1 chart-container">
                        <Link to={"/patientInfo?patientId=" + patient.id} onClick={() => {}}>
                            <DatabaseIconButton text="Dados cadastrais"/>
                        </Link>
                    </div>
                    <div className="col-1 chart-container">
                        <StatsIconButton onClick={() => setVitalSignsMeasurementPopupOpen(true)} text="Medições de sinais vitais"/>
                    </div>
                    <div className="col-1 chart-container">
                        <LifeHabitsIconButton onClick={handleLifeHabitsButton}/>
                    </div>
                    <div className="col-1 chart-container">
                        <ClinicalHistoryIconButton onClick={handleClinicalHistoryButton}/>
                    </div>
                    <div className="col-1 chart-container">
                        <IconButton2 text='Exames' iconClass='bi-graph-up-arrow' onClick={handleExamsButton}/>
                    </div>
                </div>
                <h5>Enfermeiro</h5>
                <div className="row charts-container nursery-charts-container">
                    {
                        isFirstNurseryAppointmentLoading ?
                            <Spinner></Spinner>
                            :
                            !!firstNurseryAppointment ?
                                <>
                                    <div className="chart-container col-1">
                                        <FirstChartIconButton text="Primeira consulta" date="01/01/2020"/>
                                    </div> 
                                    {
                                        /*nurseryTrackingAppointmentCharts?.map(chart => (
                                            <div className='chart-container col-1'>
                                                <Stack onClick={() => setSelectedTrackingAppointmentChartId(chart.id)}>
                                                    <ChartIconButton
                                                        text="Ficha de acompanhamento"
                                                        date={date.format(new Date(chart.date), 'DD/MM/YYYY')}
                                                    />
                                                </Stack>
                                            </div>
                                        ))*/
                                    }
                                     <div className="chart-container col-1">
                                        <Link to={`/TrackingAppointmentChart?patientId=${patient.id}&type=${TrackingAppointmentChartType.FromNursery}` }>
                                        <AddButton></AddButton>
                                        </Link>
                                        
                                    </div>
                                </>
                                :
                                <div className='chart-container col-1'>
                                    <Link to={`/FirstNurseryChart?patientId=${patient.id}`}>
                                        <AddButton label={'Adicionar primeira ficha'}/>
                                    </Link>
                                </div>

                    }
                   
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
            
            <TrackingAppointmentChartCarrousel chartIds={/*nurseryTrackingAppointmentCharts?.map(x => x.id) ?? []*/ []} defaultSelectedId={selectedTrackingAppointmentChartId} onClose={() => setSelectedTrackingAppointmentChartId(undefined)} />
        </>
    );
}