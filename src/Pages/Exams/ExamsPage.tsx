import { type } from "@testing-library/user-event/dist/type";
import { useComplementaryExamApi } from "Api/Base/useComplementaryExamApi";
import { BiopsyExamAPI, useBiopsyExamApi } from "Api/useBiopsyExamApi";
import { CulturesExamAPI, useCulturesExamApi } from "Api/useCulturesExamApi";
import { PCRExamAPI, usePcrExamApi } from "Api/usePcrExamApi";
import { PPDExamAPI, usePpdExamApi } from "Api/usePpdExamApi";
import { ToraxXRayExamAPI, useToraxXRayExamApi } from "Api/useToraxXRayExamApi";
import { ExamsTable } from "Components/Exams/ExamsTable";
import { BiopsyForm } from "Components/Forms/Exams/BiopsyForm";
import { CulturesForm } from "Components/Forms/Exams/CulturesForm";
import { PcrForm } from "Components/Forms/Exams/PcrForm";
import { PpdForm } from "Components/Forms/Exams/PpdForm";
import { ToraxXRayForm } from "Components/Forms/Exams/ToraxXRayForm";
import { MazziniPopup } from "Components/MazziniPopup/MazziniPopup";
import { PatientInfoFields } from "Components/PatientInfoFields";
import { LoadingAlert } from "Components/Utils/Alert/LoadingAlert";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { SaveSuccessAlert } from "Components/Utils/Alert/SaveSuccessAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import React, { useEffect, useMemo } from "react";
import { useCallback, useState } from "react";
import { Button, Col, Container, Nav, Row, Stack, Tab, Table } from "react-bootstrap"
import { BiopsyExam } from "Api/Types/Exams/BiopsyExam";
import { CulturesExam } from "Api/Types/Exams/CulturesExam";
import { PPDExam } from "Api/Types/Exams/PPDExam";
import { ToraxXRayExam } from "Api/Types/Exams/ToraxXRayExam";
import { PCRExam } from "Api/Types/PCRExam";
import { EToraxXRayResult } from "Api/Types/enums/EToraxXRayResult";
import { IgraForm } from "Components/Forms/Exams/IgraForm";
import { IgraExam } from "Api/Types/IgraExam";
import { BaarExamTable } from "Components/Exams/BaarExamTable";
import { OtherExamForm } from "Components/Forms/Exams/OtherExamForm";
import { OtherExamTable } from "Components/Exams/OtherExamTable";

export const ExamsPage = () => {
    const examTypeLabels = ["Raio X", "PPD", "PCR", "Biópsia", "Culturas", "BAAR", "Gerais"];

    const [ selectedExamType, setSelectedExamType ] = useState<string>(examTypeLabels[0]);

    const { patient } = useSelectedPatient();

    const onSelectNavItem = useCallback((eventKey: any) => {
        setSelectedExamType(eventKey as string);
    }, [setSelectedExamType]);

    const toraxXRayExamAPI = useToraxXRayExamApi();
    const ppdExamAPI = usePpdExamApi();
    const pcrExamAPI = usePcrExamApi();
    const culturesExamAPI = useCulturesExamApi();
    const biopsyExamAPI = useBiopsyExamApi();

    const { data: toraxXRayExams } = toraxXRayExamAPI.useAllByPatient(patient?.id);



    const [ showSuccessMessage, setShowSuccessMessage ] = useState<boolean>(false);
    //const showLoadingMessage = useMemo(() => isToraxXRayExamCreationLoading, [isToraxXRayExamCreationLoading]);

    const getXRayResultLabel = (xRayResult: EToraxXRayResult) => {
        switch (xRayResult) {
            case EToraxXRayResult.Common:
                return 'Normal';
            case EToraxXRayResult.HasOthers:
                return 'Gerais';
            case EToraxXRayResult.HasSequelae:
                return "Sequela";
            case EToraxXRayResult.HasSug:
                return "SUG"
        }
    }

    const getPpdResultLabel = (ppdResult: boolean) => {
        return ppdResult ? "SIM" : "NÃO";
    }

    const getPcrResultLabel = (pcrResult: boolean) => {
        return pcrResult ? "Positivo" : "Negativo";
    }


    return (
        <Container>
            <Row style={{marginBottom: '30px'}}>
                <PatientInfoFields patient={patient}/>
            </Row>
            <Row>
                <Col>
                    <Nav 
                        variant='tabs'
                        onSelect={onSelectNavItem}
                        activeKey={selectedExamType}
                    >
                        {
                            examTypeLabels.map(examType => (
                                <Nav.Item>
                                    <Nav.Link eventKey={examType} style={{color: 'black'}}>
                                        {examType}
                                    </Nav.Link>
                                </Nav.Item>
                            ))
                        }
                    </Nav>
                </Col>
                </Row>
                <Row>
                    {
                        !!patient
                        &&
                        <Col>
                        {
                                selectedExamType === "Raio X"
                                &&
                                <ExamsTable
                                    examType='ToraxXRay'
                                    patient={patient}
                                    tableHeaders={
                                        <> 
                                            <th>
                                                Data
                                            </th>
                                            <th>
                                                Resultado
                                            </th>
                                            <th>
                                                Observações
                                            </th>
                                        </>
                                    }
                                    renderRowFields={(exam: ToraxXRayExam) => (
                                        <>
                                        
                                            <td>{exam.date}</td>
                                            <td>{getXRayResultLabel(exam.xRayResult)}</td>
                                            <td>{exam.observations}</td>
                                        </>
                                    )}
                                    renderPopup={
                                        (show, onClose, onSubmit, patient, data) => (
                                            <MazziniPopup title='Raio X de Tórax' show={show} onClose={onClose}>
                                                <ToraxXRayForm patient={patient} onSubmit={onSubmit} data={data}/>
                                            </MazziniPopup>
                                        )
                                    }
                                />
                            }
                            {
                                selectedExamType === 'PPD'
                                &&
                                <ExamsTable
                                    examType='PPD'
                                    patient={patient}
                                    tableHeaders={
                                        <>
                                          <th>
                                            Data
                                            </th>
                                            <th>
                                                Reativo?
                                            </th>
                                            <th>
                                                Observações
                                            </th>
                                        </>
                                    }
                                    renderRowFields={
                                        (exam: PPDExam) => (
                                            <>
                                                <td>
                                                    {exam.date}
                                                </td>
                                                <td>
                                                    {getPpdResultLabel(exam.isReactiveResult)}
                                                </td>
                                                <td>
                                                    {exam.observations}
                                                </td>
                                            </>
                                        )
                                    }
                                    renderPopup={
                                        (show, onClose, onSubmit, patient, data) => (
                                            <MazziniPopup title='PPD' show={show} onClose={onClose}>
                                                <PpdForm patient={patient} onSubmit={onSubmit} data={data}/>
                                            </MazziniPopup>
                                        )
                                    }
                                />
                            }
                            {
                                selectedExamType === 'PCR'
                                &&
                                <ExamsTable
                                    examType='PCR'
                                    tableHeaders={
                                        <>
                                            <th>
                                                Data
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
                                        (exam: PCRExam) => (
                                            <>
                                                <td>
                                                    {exam.date}
                                                </td>
                                                <td>
                                                    {getPcrResultLabel(exam.isPositiveResult)}
                                                </td>
                                                <td>
                                                    {exam.observations}
                                                </td>
                                            </>
                                        )
                                    }
                                    renderPopup={
                                        (show, onClose, onSubmit, patient, data) => (
                                            <MazziniPopup title='PCR' show={show} onClose={onClose}>
                                                <PcrForm patient={patient} onSubmit={onSubmit} data={data}/>
                                            </MazziniPopup>
                                        )
                                    }
                                    patient={patient}
                                />
                            }
                            {
                                selectedExamType === 'Culturas'
                                &&
                                <ExamsTable<CulturesExam>
                                    examType='Cultures'
                                    patient={patient}
                                    tableHeaders={
                                        <>
                                            <th>
                                                Data
                                            </th>
                                            <th>
                                                Resultado
                                            </th>
                                            <th>
                                                Sítio
                                            </th>
                                            <th>
                                                Observações
                                            </th>
                                        </>
                                    }
                                    renderRowFields={(exam) => (
                                        <>
                                            <td>
                                                {exam.date}
                                            </td>
                                            <td>
                                                {getPcrResultLabel(exam.isPositiveResult)}
                                            </td>
                                            <td>
                                                {exam.site}
                                            </td>
                                            <td>
                                                {exam.observations}
                                            </td>
                                        </>
                                    )}  
                                    renderPopup={
                                        (show, onClose, onSubmit, patient, data) => (
                                            <MazziniPopup title='Culturas' show={show} onClose={onClose}>
                                                <CulturesForm patient={patient} onSubmit={onSubmit} data={data}/>
                                            </MazziniPopup>
                                        )
                                    }
                                />
                            }
                            {
                                selectedExamType === 'Biópsia'
                                &&
                                <ExamsTable<BiopsyExam>
                                    examType="Biopsy"
                                    patient={patient}
                                    tableHeaders={
                                        <>
                                            <th>
                                                Data
                                            </th>
                                            <th>
                                                Tecido analisado
                                            </th>
                                            <th>
                                                Resultado
                                            </th>
                                            <th>
                                                Observações
                                            </th>
                                        </>
                                    }
                                    renderRowFields={(exam) => (
                                        <>
                                            <td>
                                                {exam.date}
                                            </td>
                                            <td>
                                                {exam.analyzedTissue}
                                            </td>
                                            <td>
                                                {exam.result}
                                            </td>
                                            <td>
                                                {exam.observations}
                                            </td>
                                        </>
                                    )}
                                    renderPopup={
                                        (show, onClose, onSubmit, patient, data) => (
                                            <MazziniPopup title="Biópsia" show={show} onClose={onClose}>
                                                <BiopsyForm patient={patient} onSubmit={onSubmit} data={data}/>
                                            </MazziniPopup>
                                        )
                                    }
                                />
                            }
                            {
                                selectedExamType === 'Igra'
                                &&
                                <ExamsTable
                                    examType='Igra'
                                    tableHeaders={
                                        <>
                                            <th>
                                                Data
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
                                        (exam: IgraExam) => (
                                            <>
                                                <td>
                                                    {exam.date}
                                                </td>
                                                <td>
                                                    {getPcrResultLabel(exam.isPositiveResult)}
                                                </td>
                                                <td>
                                                    {exam.observations}
                                                </td>
                                            </>
                                        )
                                    }
                                    renderPopup={
                                        (show, onClose, onSubmit, patient, data) => (
                                            <MazziniPopup title='IGRA' show={show} onClose={onClose}>
                                                <IgraForm patient={patient} onSubmit={onSubmit} data={data}/>
                                            </MazziniPopup>
                                        )
                                    }
                                    patient={patient}
                                />
                            }
                            
                            {
                                selectedExamType === 'BAAR' 
                                &&
                                <BaarExamTable patient={patient}/>
                            }
                            {
                                selectedExamType === 'Gerais'
                                &&
                                <OtherExamTable patient={patient}/>
                            }
                        </Col>
                    }
                </Row>
            
        </Container>
    )
}