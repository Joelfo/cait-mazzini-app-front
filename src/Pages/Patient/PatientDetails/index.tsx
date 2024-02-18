import { ChartIconButton } from "Components/IconButton/ChartIconButton";
import PersonIconButton from "Components/IconButton/PersonIconButton";
import "./index.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_URL } from "util/requests";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { LaravelPage } from "types/vendor/LaravelPage/LaravelPage";
import { TrackingAppointmentChart } from "types/Api/TrackingAppointmentChart";
import { ETrackingAppointmentChartType } from "types/enums/ETrackingAppointmentChartType";
import AddButton from "Components/IconButton/AddButton";
import { Patient } from "types/Api/Patient";
import { usePatientsStore } from "Stores/UsePatientsStore";
import { StatsIconButton } from "Components/IconButton/StatsIconButton";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { VitalSignsMeasurementsList } from "Components/VitalSignsMeasurementList";
import FirstChartIconButton from "Components/IconButton/FirstChartIconButton";
import DatabaseIconButton from "Components/IconButton/DatabaseIconButton";
import { TrackingAppointmentChartAPI, useTrackingAppointmentChartApi } from "Api/useTrackingAppointmentChartApi";
import date from 'date-and-time'
import { TrackingAppointmentChartCarrousel } from "Components/TrackingAppointmentChart/TrackingAppointmentChartCarousel";
import { Spinner, Stack } from "react-bootstrap";
import { FirstNurseryAppointmentAPI, useFirstNurseryAppointmentApi } from "Api/useFirstNurseryAppointmentApi";
import { LifeHabitsIconButton } from "Components/IconButton/LifeHabitsIcon";
import { ClinicalHistoryIconButton } from "Components/IconButton/ClinicalHistoryIconButton";
import { LoadingAlert } from "Components/Utils/Alert/LoadingAlert";
import { IconButton2 } from "Components/IconButton/IconButton2";
import { ChartsBar } from "./ChartsBar";
import { ScannedChartPopupContent } from "Components/ScannedChartPopupContent";
import { MazziniPopup } from "Components/MazziniPopup/MazziniPopup";
import { useScannedChartAPI } from "Api/useScannedChartApi";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { SaveSuccessAlert } from "Components/Utils/Alert/SaveSuccessAlert";
import { SuccessDismissibleAlert } from "Components/Utils/Alert/SuccessDismissibleAlert";
import { PatientAPI } from "Api/PatientAPI";
import { usePatientApi } from "Api/usePatientApi";


export const PatientDetails = () => {
    // useState
    const [ vitalSignsMeasurementPopupOpen, setVitalSignsMeasurementPopupOpen ] = useState<boolean>(false);
    const [ selectedTrackingAppointmentChartId, setSelectedTrackingAppointmentChartId ] = useState<number>();
    const [ showScannedChartPopup, setShowScannedChartPopup ] = useState<boolean>(false);

    // useRef
    const scannedChartInputRef = useRef<HTMLInputElement | null>(null);
    
    // Classes
    const trackingAppointmentChartApi = useTrackingAppointmentChartApi();
    const firstNurseryAppointmentAPI = useFirstNurseryAppointmentApi();
    const patientAPI = usePatientApi();

    // custom Hooks
    const { useCheck: useCheckScannedChart, useShow: useShowScannedChart, useCreate: useCreateScannedChart } = useScannedChartAPI();

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { patient, isLoading: isPatientLoading } = useSelectedPatient();
    const setSelectedPatientId = usePatientsStore(state => state.setSelectedPatientId);
    const { data: firstNurseryAppointment, isLoading: isFirstNurseryAppointmentLoading } = firstNurseryAppointmentAPI.useGetByPatient(patient?.id);
    const { data: trackingAppointmentCharts } = trackingAppointmentChartApi.useAll();
    const { data: hasScannedChart, refetch: refetchScannedChartChecking } = useCheckScannedChart(patient?.id);
    const { mutate: getScannedChartFile } = useShowScannedChart();
    const { mutate: saveScannedChart, isLoading: isScannedChartSaveLoading, isSuccess: isScannedChartSaveSuccess } = useCreateScannedChart(); 
    const { data: patientRelationshipsInfo } = patientAPI.useShowRelationshipsInfo(patient?.id);

    // useMemo
    const nurseryTrackingCharts = useMemo(() => trackingAppointmentCharts?.filter(x => x.type === ETrackingAppointmentChartType.FromNursery) ?? [], [trackingAppointmentCharts]);
    const medicalTrackingCharts = useMemo(() => trackingAppointmentCharts?.filter(x => x.type === ETrackingAppointmentChartType.Medical) ?? [], [trackingAppointmentCharts]);
    const farmaceuticalTrackingCharts = useMemo(() => trackingAppointmentCharts?.filter(x => x.type === ETrackingAppointmentChartType.Farmaceuthical) ?? [], [trackingAppointmentCharts]);

    // callbacks
    const handleAddScannedChartButton = () => scannedChartInputRef.current?.click(); 
    const handleSelectedScannedChartFileChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        if (event.target.files) {
            saveScannedChart({ 
                patientId: patient!.id,
                file: event.target.files[0]
            }, {
                onSuccess: () => refetchScannedChartChecking()
            });
        }
    }, [saveScannedChart, patient]);
    const handleOpenScannedChartClick = () => {
        getScannedChartFile({ patientId: patient!.id }, {
            onSuccess: (scannedChartFile) => {
                const url = window.URL.createObjectURL(scannedChartFile);
                const fileLink = document.createElement('a');
                fileLink.href = url;
                fileLink.download = "ficha-escaneada";
                document.body.appendChild(fileLink);
                fileLink.click();
                fileLink.remove();
            }
        });
    }
    const handleLifeHabitsButton = useCallback(() => navigate('/lifeHabits/view?patientId=' + patient?.id), [patient, navigate])
    const handleClinicalHistoryButton = useCallback(() => navigate('/clinicalHistory/view?patientId=' + patient?.id), [patient, navigate]);
    const handleExamsButton = useCallback(() => navigate('/exams?patientId' + patient?.id), [navigate, patient]);
    const handleNewTrackingChart = useCallback((chartType: ETrackingAppointmentChartType) => navigate(`/trackingAppointmentChart?patientId=${patient?.id}&type=${chartType}`), [patient, navigate]) 
    const handleNewNurseryChart = useCallback(() => handleNewTrackingChart(ETrackingAppointmentChartType.FromNursery), [handleNewTrackingChart]);
    const handleNewMedicalChart = useCallback(() => handleNewTrackingChart(ETrackingAppointmentChartType.Medical), [handleNewTrackingChart]);
    const handleNewFarmaceuthicalChart = useCallback(() => handleNewTrackingChart(ETrackingAppointmentChartType.Farmaceuthical), [handleNewTrackingChart]);

    
    useEffect(() => {
        console.log('a');
    })

    return (
        <>
            <LoadingAlert show={isPatientLoading}/>
            {
                patient
                &&
                <>
                    <div className="container">
                        <div className="row   mb-4 mt-5">
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
                                {
                                    patientRelationshipsInfo?.hasLifeHabitsInfo ?
                                        <LifeHabitsIconButton onClick={handleLifeHabitsButton}/>
                                        :
                                        <IconButton2 iconClass="bi-clipboard-plus" text="Criar hábitos de vida"/>
                                }
                                
                            </div>
                            <div className="col-1 chart-container">
                                {
                                    patientRelationshipsInfo?.hasClinicalHistory ?
                                        <ClinicalHistoryIconButton onClick={handleClinicalHistoryButton}/>
                                        :
                                        <IconButton2 iconClass="bi-clipboard-plus" text="Criar histórico clínico"/>
                                }
                            </div>
                            <div className="col-1 chart-container">
                                <IconButton2 text='Exames' iconClass='bi-graph-up' onClick={handleExamsButton}/>
                            </div>
                            <div className="col-1 chart-container">
                                {
                                    hasScannedChart && !!patient ? 
                                        <IconButton2 text='Ficha escaneada' iconClass='bi-clipboard-check' onClick={handleOpenScannedChartClick}/>
                                        :
                                        <>
                                            <input style={{visibility: 'hidden'}} ref={scannedChartInputRef} type='file' onChange={handleSelectedScannedChartFileChange}/>
                                            <IconButton2 text='Adicionar ficha escaneada' iconClass="bi-clipboard-plus" onClick={handleAddScannedChartButton}/>
                                        </>
                                }
                            </div>
                        </div>
                        <Stack gap={2}>
                            <ChartsBar isLoading={isFirstNurseryAppointmentLoading} title='Enfermagem' charts={nurseryTrackingCharts} onClickNew={handleNewNurseryChart} /> 
                            <ChartsBar title='Médico' charts={medicalTrackingCharts} onClickNew={handleNewMedicalChart}/>
                            <ChartsBar title='Farmacêutico' charts={farmaceuticalTrackingCharts} onClickNew={handleNewFarmaceuthicalChart}/>
                        </Stack>
                    </div>
                    <MazziniPopup show={showScannedChartPopup} onClose={() => setShowScannedChartPopup(false)}>
                        <ScannedChartPopupContent patientId={patient.id}/>
                    </MazziniPopup>
                    
                </>
            }
            
            <VitalSignsMeasurementsList show={vitalSignsMeasurementPopupOpen} onClose={() => setVitalSignsMeasurementPopupOpen(false)}/>
            
            <TrackingAppointmentChartCarrousel chartIds={/*nurseryTrackingAppointmentCharts?.map(x => x.id) ?? []*/ []} defaultSelectedId={selectedTrackingAppointmentChartId} onClose={() => setSelectedTrackingAppointmentChartId(undefined)} />

            <SaveLoadingAlert show={isScannedChartSaveLoading}/>
            <SuccessDismissibleAlert showTrigger={isScannedChartSaveSuccess} text="Ficha escaneada salva com sucesso."/>
        </>
    );
}