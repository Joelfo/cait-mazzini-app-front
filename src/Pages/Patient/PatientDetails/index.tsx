import { ChartIconButton } from "Components/IconButton/ChartIconButton";
import PersonIconButton from "Components/IconButton/PersonIconButton";
import "./index.css";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { API_URL } from "util/requests";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { LaravelPage } from "types/vendor/LaravelPage/LaravelPage";
import { TrackingAppointmentChart } from "Api/Types/TrackingAppointmentChart";
import { ETrackingAppointmentChartType } from "Api/Types/enums/ETrackingAppointmentChartType";
import AddButton from "Components/IconButton/AddButton";
import { Patient } from "Api/Types/Patient";
import { usePatientsStore } from "Stores/UsePatientsStore";
import { StatsIconButton } from "Components/IconButton/StatsIconButton";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { VitalSignsMeasurementsList } from "Components/VitalSignsMeasurementList";
import FirstChartIconButton from "Components/IconButton/FirstChartIconButton";
import DatabaseIconButton from "Components/IconButton/DatabaseIconButton";
import { useTrackingAppointmentChartApi } from "Api/useTrackingAppointmentChartApi";
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
import { PhysicalExamsList } from "Components/PhysicalExamsList";
import { UserContext } from "Contexts/UserContext";
import { useUserContext } from "Contexts/useUserContext";
import { EUserRole } from "Api/Types/enums/EUserRole";
import { FirstNurseryAppointmentChartPopup } from "Components/FirstNurseryChartPopup";
import { useFirstMedicalAppointmentChartApi } from "Api/useFirstMedicalAppointmentChartApi";


export const PatientDetails = () => {
    // useState
    const [ vitalSignsMeasurementPopupOpen, setVitalSignsMeasurementPopupOpen ] = useState<boolean>(false);
    const [ selectedNurseryTrackingChartId, setSelectedNurseryTrackingChartId ] = useState<number>();
    const [ selectedMedicalTrackingChartId, setSelectedMedicalTrackingChartId ] = useState<number>();
    const [ selectedPharmaceuticalTrackingChartId, setSelectedPharmaceuticalTrackingChartId ] = useState<number>();
    const [ showScannedChartPopup, setShowScannedChartPopup ] = useState<boolean>(false);
    const [ showPhysicalExamsPopup, setShowPhysicalExamsPopup ] = useState<boolean>(false);
    const [ showFirstNurseryAppointmentPopup, setShowFirstNurseryAppointmentPopup ] = useState(false);

    // useRef
    const scannedChartInputRef = useRef<HTMLInputElement | null>(null);
    
    //custom hooks
    const trackingAppointmentChartApi = useTrackingAppointmentChartApi();
    const firstNurseryAppointmentAPI = useFirstNurseryAppointmentApi();
    const firstMedicalAppointmentChartApi = useFirstMedicalAppointmentChartApi();
    const patientAPI = usePatientApi();

    const user = useUserContext();
    const { useCheck: useCheckScannedChart, useShow: useShowScannedChart, useCreate: useCreateScannedChart } = useScannedChartAPI();

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { patient, isLoading: isPatientLoading } = useSelectedPatient();
    const setSelectedPatientId = usePatientsStore(state => state.setSelectedPatientId);
    const { data: firstNurseryAppointmentChart, isLoading: isFirstNurseryAppointmentLoading } = firstNurseryAppointmentAPI.useGetByPatient(patient?.id);
    const { data: trackingAppointmentCharts } = trackingAppointmentChartApi.useAllBasicInfoByPatient(patient?.id);
    const { data: hasScannedChart, refetch: refetchScannedChartChecking } = useCheckScannedChart(patient?.id);
    const { mutate: getScannedChartFile } = useShowScannedChart();
    const { mutate: saveScannedChart, isLoading: isScannedChartSaveLoading, isSuccess: isScannedChartSaveSuccess } = useCreateScannedChart(); 
    const { data: patientRelationshipsInfo } = patientAPI.useShowRelationshipsInfo(patient?.id);
    const { data: firstMedicalAppointmentChart, isLoading: isFirstMedicalAppointmentChartLoading } = firstMedicalAppointmentChartApi.useGetByPatient(patient?.id);

    // useMemo
    const nurseryTrackingCharts = useMemo(() => trackingAppointmentCharts?.filter(x => x.type === ETrackingAppointmentChartType.FromNursery) ?? [], [trackingAppointmentCharts]);
    const medicalTrackingCharts = useMemo(() => trackingAppointmentCharts?.filter(x => x.type === ETrackingAppointmentChartType.Medical) ?? [], [trackingAppointmentCharts]);
    const pharmaceuticalTrackingCharts = useMemo(() => trackingAppointmentCharts?.filter(x => x.type === ETrackingAppointmentChartType.Farmaceuthical) ?? [], [trackingAppointmentCharts]);
    const showSavingSuccessedAlert = useMemo(() => (searchParams.get('savedData') ?? false) as boolean, [searchParams]);

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
    const handleLifeHabitsButton = useCallback(() => navigate('/lifeHabitsView?patientId=' + patient?.id), [patient, navigate])
    const handleClinicalHistoryButton = useCallback(() => navigate('/clinicalHistory/view?patientId=' + patient?.id), [patient, navigate]);
    const handleExamsButton = useCallback(() => navigate('/exams?patientId=' + patient?.id), [navigate, patient]);
    const handleNewTrackingChart = useCallback((chartType: ETrackingAppointmentChartType) => {
        navigate(`/trackingAppointmentChart?patientId=${patient?.id}&type=${chartType}`)
    }, [patient, navigate]) 
    const handleNewNurseryChart = useCallback(() => {
        handleNewTrackingChart(ETrackingAppointmentChartType.FromNursery)
    }, [handleNewTrackingChart]);
    const handleNewMedicalChart = useCallback(() => handleNewTrackingChart(ETrackingAppointmentChartType.Medical), [handleNewTrackingChart]);
    const handleNewFarmaceuthicalChart = useCallback(() => handleNewTrackingChart(ETrackingAppointmentChartType.Farmaceuthical), [handleNewTrackingChart]);

    return (
        <>
            <LoadingAlert show={isPatientLoading}/>
            {
                patient
                &&
                <>
                    <div className="container">
                        <div className="row   mb-4 mt-5 align-items-start">
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
                                        <Link to={'/lifeHabits?patientId=' + patient.id}>
                                            <IconButton2 iconClass="bi-clipboard-plus" text="Criar hábitos de vida"/>
                                        </Link>
                                }
                                
                            </div>
                            <div className="col-1 chart-container">
                                {
                                    patientRelationshipsInfo?.hasClinicalHistory ?
                                        <ClinicalHistoryIconButton onClick={handleClinicalHistoryButton}/>
                                        :
                                        <IconButton2 iconClass="bi-clipboard-plus" text="Criar histórico clínico" onClick={() => navigate('/clinicalHistoryForm?patientId=' + patient.id)}/>
                                }
                            </div>
                            <div className="col-1 chart-container">
                                <IconButton2 text='Exames' iconClass='bi-graph-up' onClick={handleExamsButton}/>
                            </div>
                        </div>
                        <div className="row mb-4 align-items-start">
                            <div className="col-1 chart-container">
                                {
                                    hasScannedChart && !!patient ? 
                                        <IconButton2 text='Abrir ficha escaneada' iconClass='bi-paperclip' onClick={handleOpenScannedChartClick}/>
                                        :
                                        <>
                                            <input style={{visibility: 'hidden'}} ref={scannedChartInputRef} type='file' onChange={handleSelectedScannedChartFileChange}/>
                                            <IconButton2 text='Adicionar ficha escaneada' iconClass="bi-paperclip" onClick={handleAddScannedChartButton}/>
                                        </>
                                }
                            </div>
                            <div className="col-2 chart-container">
                                <IconButton2 text='Exames físicos' iconClass='bi-clipboard-check' onClick={() => setShowPhysicalExamsPopup(true)}/>
                            </div>
                        </div>
                        <Stack gap={2}>
                            <ChartsBar 
                                isLoading={isFirstNurseryAppointmentLoading} 
                                title='Enfermagem' 
                                canAddNew={user.role === EUserRole.Nurse && !!firstNurseryAppointmentChart} 
                                charts={nurseryTrackingCharts} 
                                onClickNew={handleNewNurseryChart} 
                                onClickOnChart={chart => setSelectedNurseryTrackingChartId(chart.id)} 
                                beforeContent={
                                    <>
                                        {
                                            !!firstNurseryAppointmentChart ?
                                                <IconButton2 iconClass="bi-file-earmark-text" text="Primeira ficha" onClick={() => setShowFirstNurseryAppointmentPopup(true)}/>
                                                :
                                                <IconButton2 iconClass="bi-file-earmark-plus" text="Adicionar primeira ficha" onClick={() => navigate('/firstNurseryChart?patientId=' + patient.id)}/>
                                        }
                                    </>
                                }
                            />
                            <ChartsBar 
                                title='Médico' 
                                charts={medicalTrackingCharts} 
                                canAddNew={user.role === EUserRole.Physician && !!firstMedicalAppointmentChart} 
                                onClickNew={handleNewMedicalChart} 
                                onClickOnChart={chart => setSelectedMedicalTrackingChartId(chart.id)}
                                beforeContent={
                                    <>
                                        {
                                            !!firstMedicalAppointmentChart ?
                                            <IconButton2 iconClass="bi-file-earmark-text" text="Primeira ficha" onClick={() => {}}/>
                                                :
                                            <IconButton2 iconClass="bi-file-earmark-plus" text="Adicionar primeira ficha" onClick={() => navigate('/firstMedicalChart?patientId=' + patient.id)}/>
                                        }
                                    </>
                                }
                            />
                            <ChartsBar title='Farmacêutico' charts={pharmaceuticalTrackingCharts} canAddNew={user.role === EUserRole.Pharmaceutical} onClickNew={handleNewFarmaceuthicalChart} onClickOnChart={chart => setSelectedPharmaceuticalTrackingChartId(chart.id)}/>
                        </Stack>
                    </div>
                    <MazziniPopup show={showScannedChartPopup} onClose={() => setShowScannedChartPopup(false)}>
                        <ScannedChartPopupContent patientId={patient.id}/>
                    </MazziniPopup>
                    
                </>
            }
            
            <VitalSignsMeasurementsList show={vitalSignsMeasurementPopupOpen} onClose={() => setVitalSignsMeasurementPopupOpen(false)}/>
            
            <TrackingAppointmentChartCarrousel chartIds={nurseryTrackingCharts.map(x => x.id)} defaultSelectedId={selectedNurseryTrackingChartId} onClose={() => setSelectedNurseryTrackingChartId(undefined)} />
            <TrackingAppointmentChartCarrousel chartIds={medicalTrackingCharts.map(x => x.id)} defaultSelectedId={selectedMedicalTrackingChartId} onClose={() => setSelectedMedicalTrackingChartId(undefined)} />
            <TrackingAppointmentChartCarrousel chartIds={pharmaceuticalTrackingCharts.map(x => x.id)} defaultSelectedId={selectedPharmaceuticalTrackingChartId} onClose={() => setSelectedPharmaceuticalTrackingChartId(undefined)} />

            

            <MazziniPopup title="Exames físicos" show={showPhysicalExamsPopup} onClose={() => setShowPhysicalExamsPopup(false)}>
                <PhysicalExamsList/>
            </MazziniPopup>

            <SaveLoadingAlert show={isScannedChartSaveLoading}/>
            <SuccessDismissibleAlert showTrigger={isScannedChartSaveSuccess} text="Ficha escaneada salva com sucesso."/>
            <SuccessDismissibleAlert showTrigger={showSavingSuccessedAlert} text="Dados salvos com sucesso."/>
            {
                !!firstNurseryAppointmentChart
                &&
                <FirstNurseryAppointmentChartPopup onClose={() => setShowFirstNurseryAppointmentPopup(false)} chart={firstNurseryAppointmentChart} show={showFirstNurseryAppointmentPopup}/>
            }

        </>
    );
}