import { TrackingAppointmentChart } from "types/Api/TrackingAppointmentChart";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ETrackingAppointmentChartType } from "types/enums/ETrackingAppointmentChartType";
import { TrackingAppointmentChartBasicInfo } from "types/Api/BasicInfo/TrackingAppointmentChartBasicInfo";
import { API_URL } from "util/requests";
import { useResourceAPI } from "./Base/useResourceAPI";

export class TrackingAppointmentChartAPI extends ResourceAPI<TrackingAppointmentChart> {
    public constructor() {
        super('TrackingAppointmentCharts');
    }

    useAllByPatientAndType = (patientId: number, type: ETrackingAppointmentChartType, skip: number | null = null, take: number | null = null) => {
        return useQuery<TrackingAppointmentChart[]>(
            ['Patients.' + this.resourceName + '.AllByPatientAndType', patientId, type, take],
            async () => {
                const response = await axios.get(
                    `${API_URL}Patients/${patientId}/TrackingAppointmentCharts/ByType`,
                    {
                        params: {
                            type: type,
                            skip: skip,
                            take: take
                        }
                    }
                );
                return response.data;
            } 
        )
    }


    useAllBasicInfoByPatientAndType = (patientId: number | undefined, type: ETrackingAppointmentChartType, skip: number | null = null, take: number | null = null) => {
        return useQuery<TrackingAppointmentChartBasicInfo[]>(
            ['Patients.' + this.resourceName + '.BasicInfo.AllByType', patientId, type, take],
            async () => {
                const response = await axios.get(
                   `${API_URL}/Patients/${patientId}/TrackingAppointmentCharts/BasicInfo/ByType`,
                    {
                        params: {
                            type: type,
                            take: take,
                            skip: skip
                        }
                    }
                );
                return response.data;
            },
            {
                enabled: !!patientId
            }
        )
    }
}

export const useTrackingAppointmentChartApi = () => {
    const { headers, ...resourceApi } = useResourceAPI<TrackingAppointmentChart>('TrackingAppointmentCharts');

    const useAllBasicInfoByPatientAndType = (patientId: number | undefined, type: ETrackingAppointmentChartType, skip: number | null = null, take: number | null = null) => {
        return useQuery<TrackingAppointmentChartBasicInfo[]>(
            ['Patients.' + resourceApi.resourceName + '.BasicInfo.AllByType', patientId, type, take],
            async () => {
                const response = await axios.get(
                   `${API_URL}/Patients/${patientId}/TrackingAppointmentCharts/BasicInfo/ByType`,
                    {
                        params: {
                            type: type,
                            take: take,
                            skip: skip
                        },
                        headers
                    }
                );
                return response.data;
            },
            {
                enabled: !!patientId
            }
        )
    }

    const useAllByPatientAndType = (patientId: number, type: ETrackingAppointmentChartType, skip: number | null = null, take: number | null = null) => {
        return useQuery<TrackingAppointmentChart[]>(
            ['Patients.' + resourceApi.resourceName + '.AllByPatientAndType', patientId, type, take],
            async () => {
                const response = await axios.get(
                    `${API_URL}Patients/${patientId}/TrackingAppointmentCharts/ByType`,
                    {
                        params: {
                            type: type,
                            skip: skip,
                            take: take
                        },
                        headers
                    }
                );
                return response.data;
            } 
        )
    }

    return { ...resourceApi, useAllBasicInfoByPatientAndType, useAllByPatientAndType }
}