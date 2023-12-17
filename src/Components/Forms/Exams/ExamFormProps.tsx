import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { Col, Form } from "react-bootstrap";
import { FieldValues, UseFormRegister, useForm } from "react-hook-form";
import { ComplementaryExam } from "types/Api/Exams/ComplementaryExam";
import { ToraxXRayExam } from "types/Api/Exams/ToraxXRayExam";
import { Patient } from "types/Api/Patient";
import { justRequiredRule } from "util/validation";

export type ExamFormProps<TExam extends ComplementaryExam> = {
    onSubmit: (data: TExam) => void,
    patient: Patient,
    data?: TExam
}
