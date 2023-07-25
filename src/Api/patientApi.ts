import axios from "axios"
import { API_URL } from "util/requests"

export const show = (id : number) => {
    return axios.get(
        `${API_URL}/patients/${id}`
    );
}
