import { usePhysicalExamApi } from "Api/usePhysicalExamApi"
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { IconButton2 } from "./IconButton/IconButton2";
import { PhysicalExam } from "Api/Types/PhysicalExam";
import { ETrackingAppointmentChartType } from "Api/Types/enums/ETrackingAppointmentChartType";
import { Stack } from "react-bootstrap";
import { usePatientApi } from "Api/usePatientApi";
import { Link, useNavigate } from "react-router-dom";

export const PhysicalExamsList = () => {
    const { patient } = useSelectedPatient();
    const physicalExamApi = usePhysicalExamApi();
    const { data: physicalExams } = physicalExamApi.useAllByPatient(patient?.id);

    const navigate = useNavigate();

    const resolvePhysicalExamLabel = (physicalExam: PhysicalExam) => {
        const type = physicalExam.type === ETrackingAppointmentChartType.FromNursery ? "Enfermagem" : "Médico";
        const date = new Date(physicalExam.date).toLocaleDateString();
        return `${type}-${date}`;
    }

    return (
        <>
            <Stack gap={5} direction="horizontal">
                {
                    physicalExams?.map(physicalExam => (
                        <div>
                            <Link to={`/physicalExam?id=${physicalExam.id}&patientId=${patient?.id}`} target='_blank'>
                                <IconButton2 text={resolvePhysicalExamLabel(physicalExam)} iconClass="bi-file-earmark-text"/>
                            </Link>
                        </div>
                    ))
                }
                <div>
                    <IconButton2 text="Novo exame físico" iconClass="bi-file-earmark-plus" onClick={() => navigate('/physicalExamForm?patientId=' + patient?.id)}/>
                </div>
            </Stack>
        </>
    )
};