import { BaarExam } from "Api/Types/Exams/BaarExam";
import { ExamTableProps } from "./Types/ExamTableProps";
import { MazziniPopup } from "Components/MazziniPopup/MazziniPopup";
import { BaarForm } from "Components/Forms/Exams/BaarForm";
import { ExamsTable } from "./ExamsTable";
import { OtherExam } from "Api/Types/Exams/OtherExam";
import { OtherExamForm } from "Components/Forms/Exams/OtherExamForm";

export const OtherExamTable = ({ patient } : ExamTableProps) => {
    return (<ExamsTable<OtherExam>
    examType='Other'
    tableHeaders={
        <>
            <th>
                Data
            </th>
            <th>
                Nome
            </th>
            <th>
                Observações
            </th>
        </>
    }
    renderRowFields={
        (exam: OtherExam) => (
            <>
                <td>
                    {exam.date}
                </td>
                <td>
                    {exam.name}
                </td>
                <td>
                    {exam.observations}
                </td>
            </>
        )
    }
    renderPopup={
        (show, onClose, onSubmit, patient, data) => (
            <MazziniPopup title='BAAR' show={show} onClose={onClose}>
                <OtherExamForm patient={patient} onSubmit={onSubmit} data={data}/>
            </MazziniPopup>
        )
    }
    patient={patient}
/>);
}