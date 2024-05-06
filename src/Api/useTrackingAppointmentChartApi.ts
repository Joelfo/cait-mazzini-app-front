import { TrackingAppointmentChart } from "Api/Types/TrackingAppointmentChart";
import { ResourceAPI } from "./Base/ResourceAPI";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ETrackingAppointmentChartType } from "Api/Types/enums/ETrackingAppointmentChartType";
import { TrackingAppointmentChartBasicInfo } from "Api/Types/BasicInfo/TrackingAppointmentChartBasicInfo";
import { API_URL } from "util/requests";
import { useResourceAPI } from "./Base/useResourceAPI";

export const useTrackingAppointmentChartApi = () => {
    const { headers, ...resourceApi } = useResourceAPI<TrackingAppointmentChart>('TrackingAppointmentCharts');

    const useAllBasicInfoByPatient = (patientId: number | undefined, skip: number | null = null, take: number | null = null) => {
        return useQuery<TrackingAppointmentChartBasicInfo[]>(
            ['Patients.' + resourceApi.resourceName + '.BasicInfo', patientId, take],
            async () => {
                const response = await axios.get(
                    `${API_URL}/Patients/${patientId}/TrackingAppointmentCharts/BasicInfo`,
                    {
                        params: {
                            skip: skip,
                            take: take
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

    return { ...resourceApi, useAllBasicInfoByPatient }
}