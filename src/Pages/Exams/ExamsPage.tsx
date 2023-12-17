import { type } from "@testing-library/user-event/dist/type";
import { BiopsyExamAPI } from "Api/BiopsyExamAPI";
import { CulturesExamAPI } from "Api/CulturesExamAPI";
import { PCRExamAPI } from "Api/PCRExamAPI";
import { PPDExamAPI } from "Api/PPDExamAPI";
import { ToraxXRayExamAPI } from "Api/ToraxXRayExamAPI";
import { ExamsTable } from "Components/ExamsTable";
import { BiopsyForm } from "Components/Forms/Exams/BiopsyForm";
import { CulturesForm } from "Components/Forms/Exams/CulturesForm";
import { PcrForm } from "Components/Forms/Exams/PcrForm";
import { PpdForm } from "Components/Forms/Exams/PpdForm";
import { ToraxXRayForm } from "Components/Forms/Exams/ToraxXRayForm";
import { MazziniPopup } from "Components/MazziniPopup/MazziniPopup";
import { LoadingAlert } from "Components/Utils/Alert/LoadingAlert";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { SaveSuccessAlert } from "Components/Utils/Alert/SaveSuccessAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import React, { useEffect, useMemo } from "react";
import { useCallback, useState } from "react";
import { Button, Col, Container, Nav, Row, Stack, Tab, Table } from "react-bootstrap"
import { BiopsyExam } from "types/Api/Exams/BiopsyExam";
import { CulturesExam } from "types/Api/Exams/CulturesExam";
import { PPDExam } from "types/Api/Exams/PPDExam";
import { ToraxXRayExam } from "types/Api/Exams/ToraxXRayExam";
import { PCRExam } from "types/Api/PCRExam";
import { EToraxXRayResult } from "types/enums/EToraxXRayResult";

export const ExamsPage = () => {
    const examTypes = ["Raio X", "PPD", "PCR", "Biópsia", "Culturas"]

    const [ selectedExamType, setSelectedExamType ] = useState<string>(examTypes[0]);

    const { patient } = useSelectedPatient();

    const onSelectNavItem = useCallback((eventKey: any) => {
        setSelectedExamType(eventKey as string);
    }, [setSelectedExamType]);

    const toraxXRayExamAPI = new ToraxXRayExamAPI();
    const ppdExamAPI = new PPDExamAPI();
    const pcrExamAPI = new PCRExamAPI();
    const culturesExamAPI = new CulturesExamAPI();
    const biopsyExamAPI = new BiopsyExamAPI();

    const { data: toraxXRayExams } = toraxXRayExamAPI.useAllByPatient(patient?.id);

    const { mutate: createToraxXRayExam, isLoading: isToraxXRayExamCreationLoading, isSuccess: isToraxXRayExamCreationSuccess } = toraxXRayExamAPI.useCreate();
    const { mutate: createPpdExam, isLoading: isPpdExamCreationLoading, isSuccess: isPpdExamCreationSuccess } = ppdExamAPI.useCreate();

    const [ showSuccessMessage, setShowSuccessMessage ] = useState<boolean>(false);
    const showLoadingMessage = useMemo(() => isToraxXRayExamCreationLoading, [isToraxXRayExamCreationLoading]);

    const getXRayResultLabel = (xRayResult: EToraxXRayResult) => {
        switch (xRayResult) {
            case EToraxXRayResult.Common:
                return 'Normal';
            case EToraxXRayResult.HasOthers:
                return 'Outros';
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

    useEffect(() => {
        setShowSuccessMessage(isToraxXRayExamCreationSuccess);
    }, [isToraxXRayExamCreationSuccess]);

    return (
        <Container>
            <Row>
                <Col>
                    <Nav 
                        variant='tabs'
                        onSelect={onSelectNavItem}
                        activeKey={selectedExamType}
                    >
                        {
                            examTypes.map(examType => (
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
                    <Col>
                    {
                            selectedExamType === "Raio X"
                            &&
                            <ExamsTable
                                api={toraxXRayExamAPI}
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
                                        <MazziniPopup show={show} onClose={onClose}>
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
                                api={ppdExamAPI}
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
                                        <MazziniPopup show={show} onClose={onClose}>
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
                                        <MazziniPopup show={show} onClose={onClose}>
                                            <PcrForm patient={patient} onSubmit={onSubmit} data={data}/>
                                        </MazziniPopup>
                                    )
                                }
                                patient={patient}
                                api={pcrExamAPI}
                            />
                        }
                        {
                            selectedExamType === 'Culturas'
                            &&
                            <ExamsTable
                                api={culturesExamAPI}
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
                                        <MazziniPopup show={show} onClose={onClose}>
                                            <CulturesForm patient={patient} onSubmit={onSubmit} data={data}/>
                                        </MazziniPopup>
                                    )
                                }
                            />
                        }
                        {
                            selectedExamType === 'Biópsia'
                            &&
                            <ExamsTable
                                api={biopsyExamAPI}
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
                                        <MazziniPopup show={show} onClose={onClose}>
                                            <BiopsyForm patient={patient} onSubmit={onSubmit} data={data}/>
                                        </MazziniPopup>
                                    )
                                }
                            />
                        }
                    </Col>
                </Row>
            
        </Container>
    )
}