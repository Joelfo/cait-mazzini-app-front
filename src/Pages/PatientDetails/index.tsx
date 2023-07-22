import { ChartIconButton } from "Components/IconButton/ChartIconButton";
import PersonIconButton from "Components/IconButton/PersonIconButton";
import "./index.css";
import { useEffect, useState } from "react";
import { API_URL } from "util/requests";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LaravelPage } from "types/vendor/LaravelPage/LaravelPage";
import { TrackingAppointmentChart } from "types/TrackingAppointmentChart";
import { TrackingAppointmentChartType } from "types/enums/TrackingAppointmentChartType";
import AddButton from "Components/IconButton/AddButton";

export const PatientDetails = () => {
    const { patientId } = useParams(); 
    const [nurseryTrackingAppointmentChartsPage, setNurseryTrackingAppointmentChartsPage] = useState<LaravelPage<TrackingAppointmentChart>>();
    const [medicalTrackingAppointmentChartsPage, setMedicalTrackingAppointmentChartsPage] = useState<LaravelPage<TrackingAppointmentChart>>();
    const [farmacyTrackingAppointmentChartsPage, setFarmacyTrackingAppointmentChartsPage] = useState<LaravelPage<TrackingAppointmentChart>>();


    useEffect(() => {
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
    }, [])
    return (
        <>
            <div className="container">
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
                        <AddButton></AddButton>
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
        </>
    );
}