import { BaarExam } from "Api/Types/Exams/BaarExam"
import { ExamsTable } from "./ExamsTable"
import { MazziniPopup } from "Components/MazziniPopup/MazziniPopup"
import { BaarForm } from "Components/Forms/Exams/BaarForm"
import { ExamTableProps } from "./Types/ExamTableProps"
import { useCallback } from "react"
import { EBaarResult } from "Api/Types/enums/EBaarResult"
import { ESputumAspect } from "Api/Types/enums/ESputumAspect"


export const BaarExamTable = ({ patient } : ExamTableProps) => {

    const getResultLabel = useCallback((result: EBaarResult) => {
        switch (result) {
            case EBaarResult.Negative:
                return 'Negativo';
            case EBaarResult.Positive:
                return 'Positivo';
            case EBaarResult.PositivePlus:
                return 'Positivo (+)';
            case EBaarResult.PositiveDoublePlus:
                return 'Positivo (++)';
            case EBaarResult.PositiveTriplePlus:
                return 'Positivo (+++)';
        }
    }, []);

    const getSputumAspectLabel = useCallback((aspect: ESputumAspect) => {
        switch (aspect) {
            case ESputumAspect.Spittle:
                return 'Saliva';
            case ESputumAspect.Bloody:
                return 'Sanguinolento';
            case ESputumAspect.Purulent:
                return 'Purulento';
            case ESputumAspect.Mucopurulent:
                return 'Mucopurulento';
            case ESputumAspect.Liquefied:
                return 'Liquefeito';
        }
    }, []); 

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
                        Nº da Amostra
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
                            {exam.monthNumber}
                        </td>
                        <td>
                            {exam.sampleNumber}
                        </td>
                        <td>
                            {
                                exam.isMaterialSputum ? 'Escarro' : exam.otherMaterial
                            }
                        </td>
                        <td>
                            {exam.sputumAspect ? getSputumAspectLabel(exam.sputumAspect) : 'Outro material utilizado'}
                        </td>
                        <td>
                            {getResultLabel(exam.result)}
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