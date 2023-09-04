import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TrackingAppointmentChart } from "types/TrackingAppointmentChart";
import { API_URL } from "util/requests";
import { getApiAuthHeaders } from "./Util/ApiAuthHeaders";


export const usePost = () => 
    useMutation(async (trackingAppointmentChart: TrackingAppointmentChart) => {
        const response = await axios.post(
            API_URL + '/trackingAppointmentCharts',
            {
                ...trackingAppointmentChart
            },
            {
                headers: getApiAuthHeaders()
            }
        );
    });