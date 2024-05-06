import { BaarExam } from "Api/Types/Exams/BaarExam"
import { ExamsTable } from "./ExamsTable"
import { MazziniPopup } from "Components/MazziniPopup/MazziniPopup"
import { BaarForm } from "Components/Forms/Exams/BaarForm"
import { ExamTableProps } from "./Types/ExamTableProps"


export const BaarExamTable = ({ patient } : ExamTableProps) => {

    return (
        <ExamsTable
            examType='Baar'
            tableHeaders={
                <>
                    <th>
                        Data
                    </th>
                    <th>
                        Mês
                    </th>
                    <th>
                        Amostra
                    </th>
                    <th>
                        Material
                    </th>
                    <th>
                        Aspecto do escarro
                    </th>
                    <th>
                        Resultado
                    </th>
                    <th>
                        Observações
                    </th>
                </>
            }
            renderRowFields={
                (exam: BaarExam) => (
                    <>
                        <td>
                            {exam.date}
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
                        <BaarForm patient={patient} onSubmit={onSubmit} data={data}/>
                    </MazziniPopup>
                )
            }
            patient={patient}
        />
    )
} 