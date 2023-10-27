import { FirstNurseryAppointment } from "types/Api/FirstNurseryAppointment";
import { ResourceAPI } from "./Base/ResourceAPI";

export class FirstNurseryAppointmentAPI extends ResourceAPI<FirstNurseryAppointment> {
    constructor() {
        super('FirstNurseryAppointments');
    }
} 