import { ChartIconButton } from "Components/IconButton/ChartIconButton";
import PersonIconButton from "Components/IconButton/PersonIconButton";
import "./index.css";
import { useEffect, useRef, useState } from "react";
import { API_URL } from "util/requests";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { LaravelPage } from "types/vendor/LaravelPage/LaravelPage";
import { TrackingAppointmentChart } from "types/TrackingAppointmentChart";
import { TrackingAppointmentChartType } from "types/enums/TrackingAppointmentChartType";
import AddButton from "Components/IconButton/AddButton";
import { Patient } from "types/Patient";
import { usePatientsStore } from "Stores/UsePatientsStore";
import { StatsIconButton } from "Components/IconButton/StatsIconButton";
import { VitalSignsMeasurementPopup } from "Components/VitalSignsMeasurementPopup";

export const PatientDetails = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const patientId = usePatientsStore(state => state.selectedPatientId) ?? 1;
    const setSelectedPatientId = usePatientsStore(state => state.setSelectedPatientId);
    const [nurseryTrackingAppointmentChartsPage, setNurseryTrackingAppointmentChartsPage] = useState<LaravelPage<TrackingAppointmentChart>>();
    const [medicalTrackingAppointmentChartsPage, setMedicalTrackingAppointmentChartsPage] = useState<LaravelPage<TrackingAppointmentChart>>();
    const [farmacyTrackingAppointmentChartsPage, setFarmacyTrackingAppointmentChartsPage] = useState<LaravelPage<TrackingAppointmentChart>>();
    const [patient, setPatient] = useState<Patient | null>(null);
    useEffect(() => {
        axios.get(
            `${API_URL}/patients/${patientId}`,
        ).then((response) => setPatient(response.data));

        axios.get(
            `${API_URL}/patients/${patientId}/trackingAppointmentCharts/${TrackingAppointmentChartType.Nursery}`,
            {
                params: {
                    limit: 4,
                    page: 1
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((response) => {
            setNurseryTrackingAppointmentChartsPage(response.data);
        }).catch(error => console.log(error));

        axios.get(
            `${API_URL}/patients/${patientId}/trackingAppointmentCharts/${TrackingAppointmentChartType.Medical}`,
            {
                params: {
                    limit: 4,
                    page: 1
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((response) => {
            setMedicalTrackingAppointmentChartsPage(response.data);
        }).catch(error => console.log(error));

        axios.get(
            `${API_URL}/patients/${patientId}/trackingAppointmentCharts/${TrackingAppointmentChartType.Farmacy}`,
            {
                params: {
                    limit: 4,
                    page: 1
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((response) => {
            setFarmacyTrackingAppointmentChartsPage(response.data);
        }).catch(error => console.log(error));
    }, []);

    
    const [ vitalSignsMeasurementPopupOpen, setVitalSignsMeasurementPopupOpen ] = useState<boolean>(false);

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
                        <Link to={"/patientForm"} onClick={() => setSelectedPatientId(patient.id)}>
                            <ChartIconButton text="Ficha Cadastral" date=""/>
                        </Link>
                    </div>
                    <div className="col-1 chart-container">
                        <StatsIconButton onClick={() => setVitalSignsMeasurementPopupOpen(true)} text="Medições de sinais vitais"/>
                    </div>
                </div>
                <h5>Enfermeiro</h5>
                <div className="row charts-container nursery-charts-container">
                    <div className="chart-container col-1">
                        <ChartIconButton text="Primeira consulta" date="01/01/2020"/>
                    </div>
                    {
                        nurseryTrackingAppointmentChartsPage
                        &&
                        nurseryTrackingAppointmentChartsPage.data.map(trackingAppointmentChart => (
                            <div className="chart-container col-1" key={trackingAppointmentChart.id.toString()}>
                                <ChartIconButton text="Acompanhamento" date={trackingAppointmentChart.date}/>
                            </div>
                        ))
                    }
                    <div className="chart-container col-1">
                        <Link to={'/TrackingAppointmentChart?patientId=' + patientId}>
                        <AddButton></AddButton>
                        </Link>
                        
                    </div>
                </div>
                
                <h5>Médico</h5>
                <div className="row charts-container medical-charts-container">
                    <div className="chart-container col-1">
                            <ChartIconButton text="Primeira consulta" date="01/01/2020"/>
                    </div>
                    {
                        medicalTrackingAppointmentChartsPage
                        &&
                        medicalTrackingAppointmentChartsPage.data.map(trackingAppointmentChart => (
                            <div className="chart-container col-1" key={trackingAppointmentChart.id.toString()}>
                                <ChartIconButton text="Acompanhamento" date={trackingAppointmentChart.date}/>
                            </div>
                        ))
                    }
                    <div className="chart-container col-1">
                        <AddButton></AddButton>
                    </div>
                </div>
                <h5>Farmacêutico</h5>
                <div className="row charts-container farmacy-charts-container">
                    {
                        farmacyTrackingAppointmentChartsPage
                        &&
                        farmacyTrackingAppointmentChartsPage.data.map(trackingAppointmentChart => (
                            <div className="chart-container col-1" key={trackingAppointmentChart.id.toString()}>
                                <ChartIconButton text="Acompanhamento" date={trackingAppointmentChart.date}/>
                            </div>
                        ))
                    }
                    <div className="chart-container col-1">
                        <AddButton></AddButton>
                    </div>
                </div>
            </div>
            }
            <VitalSignsMeasurementPopup show={vitalSignsMeasurementPopupOpen} onClose={() => setVitalSignsMeasurementPopupOpen(false)}/>
        </>
    );
}