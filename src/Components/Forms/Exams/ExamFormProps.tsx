import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { Col, Form } from "react-bootstrap";
import { FieldValues, UseFormRegister, useForm } from "react-hook-form";
import { ComplementaryExam } from "Api/Types/Exams/ComplementaryExam";
import { ToraxXRayExam } from "Api/Types/Exams/ToraxXRayExam";
import { Patient } from "Api/Types/Patient";
import { justRequiredRule } from "util/validation";
import { ComplementaryExamDTO } from "Api/Types/DTOs/ComplementaryExamDTO";

export type ExamFormProps<TExam extends ComplementaryExam> = {
    onSubmit: (data: ComplementaryExamDTO<TExam>) => void,
    patient: Patient,
    data?: TExam
}
