import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios"
import { Patient } from "types/Patient";
import { API_URL } from "util/requests"
import { ResourceAPI } from "./ResourceAPI";

export class PatientAPI extends ResourceAPI<Patient> {
    public constructor(){
        super('Patient');
    }
}