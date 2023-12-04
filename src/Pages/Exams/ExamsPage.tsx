import { type } from "@testing-library/user-event/dist/type";
import { BiopsyExamAPI } from "Api/BiopsyExamAPI";
import { CulturesExamAPI } from "Api/CulturesExamAPI";
import { PCRExamAPI } from "Api/PCRExamAPI";
import { PPDExamAPI } from "Api/PPDExamAPI";
import { ToraxXRayExamAPI } from "Api/ToraxXRayExamAPI";
import { ExamTableSubPage } from "Components/ExamTableSubPage";
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
import { Button, Col, Container, Nav, Row, Stack, Table } from "react-bootstrap"
import { ToraxXRayExam } from "types/Api/Exams/ToraxXRayExam";
import { EToraxXRayResult } from "types/enums/EToraxXRayResult";

type DownloadButtonProps = {
    onClick: () => void
}


const DownloadButton = ({ onClick } : DownloadButtonProps) => {
    return (
        <Button variant='primary' size='sm' onClick={onClick} style={{padding: '2px 6px'}}>
            <i className="bi bi-download" style={{color: 'white', fontSize: 20}}></i>
        </Button>
    );
}

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


    const getPpdResultLabel = (ppdResult: boolean) => {
        return ppdResult ? "SIM" : "NÃO";
    }

    const getPcrResultLabel = (pcrResult: boolean) => {
        return pcrResult ? "Positivo" : "Negativo";
    }

    const onClickNew = () => {
        console.log('q');
        switch(selectedExamType) {
            case "Raio X":
                setShowToraxXRayForm(true);
                break;
            case "PPD":
                setShowPpdForm(true);
                break;
            case "PPD":
                
        }
    }

    const onSubmitXRayExam = () => {
        
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
                                    <Nav.Link eventKey={examType}>
                                        {examType}
                                    </Nav.Link>
                                </Nav.Item>
                            ))
                        }
                    </Nav>
                    <Table striped bordered hover>
                        {
                            selectedExamType === "Raio X"
                            &&
                            <React.Fragment>
                                <thead>
                                    <tr>
                                        <th>
                                            Data
                                        </th>
                                        <th>
                                            Resultado
                                        </th>
                                        <th>
                                            Observações
                                        </th>
                                        <th>
                                            Arquivos
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        toraxXRayExams?.map(exam => (
                                            <tr>
                                                <td>{exam.date}</td>
                                                <td>{getXRayResultLabel(exam.xRayResult)}</td>
                                                <td>{exam.observations}</td>
                                                <td> <DownloadButton onClick={() => {}}/> </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </React.Fragment>
                        }
                        {
                            selectedExamType === 'PPD'
                            &&
                            <React.Fragment>
                                <thead>
                                    <tr>
                                        <th>
                                            Data
                                        </th>
                                        <th>
                                            Reativo?
                                        </th>
                                        <th>
                                            Observações
                                        </th>
                                        <th>
                                            Arquivos
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ppdExams?.map(ppdExam => (
                                            <tr>
                                                <td>
                                                    {ppdExam.date}
                                                </td>
                                                <td>
                                                    {getPpdResultLabel(ppdExam.isReactiveResult)}
                                                </td>
                                                <td>
                                                    {ppdExam.observations}
                                                </td>
                                                <td>
                                                <DownloadButton onClick={() => {}}/>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </React.Fragment>
                        }
                        {
                            selectedExamType === 'PCR'
                            &&
                            <ExamTableSubPage 
                                renderTable={
                                    (data) => (
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        Data
                                                    </th>
                                                    <th>
                                                        Resultado
                                                    </th>
                                                    <th>
                                                        Observações
                                                    </th>
                                                    <th>
                                                        Arquivos
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data?.map(exam => (
                                                        <tr>
                                                            <td>
                                                                {exam.date}
                                                            </td>
                                                            <td>
                                                                {getPcrResultLabel(exam.isPositiveResult)}
                                                            </td>
                                                            <td>
                                                                {exam.observations}
                                                            </td>
                                                            <td>
                                                                <DownloadButton onClick={() => {}}/>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    )
                                }
                                renderPopup={
                                    (show, onClose, onSubmit, patient) => (
                                        <MazziniPopup show={show} onClose={onClose}>
                                            <PcrForm patient={patient} onSubmit={onSubmit}/>
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
                            <React.Fragment>
                                <thead>
                                    <tr>
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
                                        <th>
                                            Arquivos
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        culturesExams?.map(exam => (
                                            <tr>
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
                                                <td>
                                                    <DownloadButton onClick={() => {}}/>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </React.Fragment>
                        }
                        {
                            selectedExamType === 'Biópsia'
                            &&
                            <React.Fragment>
                                <thead>
                                    <tr>
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
                                        <th>
                                            Arquivos
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        biopsyExams?.map(exam => (
                                            <tr>
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
                                                <td>
                                                    <DownloadButton onClick={() => {}}/>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </React.Fragment>
                        }
                    </Table>
                </Col>
            </Row>
            
        </Container>
    )
}