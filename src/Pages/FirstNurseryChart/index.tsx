import { ClinicalHistoryAPi } from "Api/ClinicalHistoryAPI";
import { LifeHabitsInfoAPI } from "Api/LifeHabitsInfoAPI";
import { PhysicalActivityAPI } from "Api/PhysicalActivityAPI";
import { PhysicalExamAPI } from "Api/PhysicalExamAPI";
import { ClinicalHistoryForm } from "Components/ClinicalHistoryForm";
import { FirstAppointmentForm } from "Components/FirstAppointmentForm";
import { LifeHabitsForm } from "Components/LifeHabitsForm";
import { PhysicalExamForm } from "Components/PhysicalExamForm";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { produce } from "immer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Col, Container, Form, ProgressBar, Row } from "react-bootstrap"
import { ClinicalHistory } from "types/Api/DTOs/ClinicalHistory";
import { LifeHabitsInfo } from "types/Api/DTOs/LifeHabitsInfoDTO";
import { PhysicalActivity } from "types/Api/DTOs/PhysicalActivity";
import { PhysicalExam } from "types/Api/DTOs/PhysicalExam";
import { FirstAppointment } from "types/Api/DTOs/FirstAppointment";
import { FirsNurseryAppointmentEndingForm } from "Components/FirstAppointmentForm/FirstNurseryAppointmentEndingForm";
import { FirstNurseryAppointment } from "types/Api/DTOs/FirstNurseryAppointment";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { FirstNurseryAppointmentAPI } from "Api/FirstNurseryAppointmentAPI";
import { useNavigate } from "react-router-dom";
import { PatientInfoFields } from "Components/PatientInfoFields";

export const FirstNurseryChartPage = () => {
    
    const formSections = ['Acompanhamento', 'Hábitos de vida', 'Histórico Clínico e Cirúrgico', 'Exame Físico', 'Diagnóstico e Conduta']

    const [ selectedSectionIndex, setSelectedSectionIndex ] = useState<number>(0);

    const progressBarLevel = useMemo(() => 100 / 6 * (selectedSectionIndex + 1), [selectedSectionIndex]);

    const [ formContent, setFormContent ] = useState<FirstNurseryForm>({newPhysicalActivities: []});

    const [ firstAppointmentBegining, setFirstAppointmentBegining ] = useState<FirstAppointment>()

    const { patient } = useSelectedPatient();

    const navigate = useNavigate();

    const physicalActivityAPI = new PhysicalActivityAPI();
    const lifeHabitsInfoAPI = new LifeHabitsInfoAPI();
    const clinicalHistoryAPI = new ClinicalHistoryAPi();
    const physicalExamAPI = new PhysicalExamAPI();
    const firstNurseryAppointmentAPI = new FirstNurseryAppointmentAPI();
    const { mutate: savePhysicalActivity } = physicalActivityAPI.useCreate();
    const { mutate: saveLifeHabitsInfo, isSuccess: isLifeHabitsInfoSaved } = lifeHabitsInfoAPI.useCreate();
    const { mutate: saveClinicalHistory, isSuccess: isClinicalHistorySaved } = clinicalHistoryAPI.useCreate();
    const { mutate: savePhysicalExam, isSuccess: isPhysicalExamSaved } = physicalExamAPI.useCreate();
    const { mutate: saveFirstNurseryAppointment, isSuccess: isFirstNuseryAppointmentSaved } = firstNurseryAppointmentAPI.useCreate();

    const [ newPhysicalActivityIds, setNewPhysicalActivityIds ] = useState<number[]>([]);

    const [ isSavingLoading, setIsSavingLoading ] = useState<boolean>(false);

    const onSubmitFirstAppointment = useCallback((data: FirstAppointment) => { 
        setFirstAppointmentBegining(data);
        setSelectedSectionIndex(current => current + 1);
    }, [])

    const onSubmitLifeHabits = useCallback((data: LifeHabitsInfo, newPhysicalActivities: PhysicalActivity[]) => {
        setFormContent(produce(formContent, formContent => {
            formContent.lifeHabits = data;
            formContent.newPhysicalActivities = newPhysicalActivities;
        }))
        setSelectedSectionIndex(current => current + 1);
    }, [formContent]);

    const onSubmitClinicalHistory = useCallback((data: ClinicalHistory) => {
        setFormContent(produce(formContent, formContent => {
            formContent.clinicalHistory = data;
        }))
        setSelectedSectionIndex(current => current + 1);
    }, [formContent]);

    const onSubmitPhysicalExam = useCallback((data: PhysicalExam) => {
        setFormContent(produce(formContent, formContent => {
            formContent.physicalExam = data;
        }))
        setSelectedSectionIndex(current => current + 1);
    }, [formContent]);

    const onSubmitFirstNurseryAppointment = useCallback((data: FirstNurseryAppointment) => setFormContent(produce(formContent, formContent => {
        formContent.firstNurseryAppointment = data;
    })), [formContent]);

    const onReturn = useCallback(() => {
        setSelectedSectionIndex(current => current - 1);
    }, [selectedSectionIndex]);

    useEffect(() => {
        if (!!formContent.clinicalHistory && !!formContent.firstNurseryAppointment && !!formContent.lifeHabits && !!formContent.physicalExam) {
            setIsSavingLoading(true);
            if (formContent.newPhysicalActivities.length > 0 ) {
                formContent.newPhysicalActivities.forEach(newPhysicalActivity => savePhysicalActivity(newPhysicalActivity, {
                    onSuccess: (id) => {
                        setNewPhysicalActivityIds(produce(newPhysicalActivityIds, newPhysicalActivityIds => {
                            newPhysicalActivityIds.push(id);
                        }));
                    }
                }))
            } else {
                saveLifeHabitsInfo(formContent.lifeHabits!);
            }
            saveClinicalHistory(formContent.clinicalHistory!);
            savePhysicalExam(formContent.physicalExam!);
            saveFirstNurseryAppointment(formContent.firstNurseryAppointment);
        }
    }, [formContent]);

    useEffect(() => {
        if (newPhysicalActivityIds.length > 0 && newPhysicalActivityIds.length === formContent.newPhysicalActivities.length) {
            saveLifeHabitsInfo(formContent.lifeHabits!);
        }
    }, [newPhysicalActivityIds]);

    useEffect(() => {
        if (isClinicalHistorySaved && isFirstNuseryAppointmentSaved && isLifeHabitsInfoSaved && isPhysicalExamSaved) {
            navigate('/home?savedData=true')
        }
    }, [isClinicalHistorySaved, isFirstNuseryAppointmentSaved, isLifeHabitsInfoSaved, isPhysicalExamSaved]);

    return (
        <>
        <Container>
            <Row>
                <Col className="d-flex justify-content-center">
                    <h2 className='fs-3'>1ª Ficha - Enfermagem</h2>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col className='d-flex justify-content-center'>
                    <h3 className='fs-5'> {formSections[selectedSectionIndex]} </h3>
                </Col>
            </Row>
            <Row className='justify-content-center mt-2'>
                <Col sm='3'>
                    <ProgressBar now={progressBarLevel} variant='primary' animated/>
                </Col>
            </Row>
            <Row>
                <PatientInfoFields patient={patient}/>
            </Row>
            <Row className='form-mazzini-row'>
                <Col>
                    {
                        (selectedSectionIndex === 0)
                        &&
                        <FirstAppointmentForm onSubmit={onSubmitFirstAppointment} defaultData={firstAppointmentBegining}/>
                    }
                    {
                        (selectedSectionIndex === 1)
                        &&
                        <LifeHabitsForm onSubmit={onSubmitLifeHabits} showReturnButton onReturn={onReturn} defaultData={formContent.lifeHabits}/>
                    }
                    {
                        (selectedSectionIndex === 2)
                        &&
                        <ClinicalHistoryForm onSubmit={onSubmitClinicalHistory} showReturnButton onReturn={onReturn} defaultData={formContent.clinicalHistory}/>
                    }
                    {
                        (selectedSectionIndex === 3)
                        &&
                        <PhysicalExamForm onSubmit={onSubmitPhysicalExam} showReturnButton onReturn={onReturn} defaultData={formContent.physicalExam}/>
                    }
                    {
                        (selectedSectionIndex === 4)
                        &&
                        <FirsNurseryAppointmentEndingForm firstAppointmentData={firstAppointmentBegining!} onSubmit={onSubmitFirstNurseryAppointment} onReturn={onReturn}/>
                    }
                </Col>
            </Row>
        </Container> 
        <SaveLoadingAlert show={isSavingLoading} />
        </>
    )
}

type FirstNurseryForm = {
    firstNurseryAppointment?: FirstNurseryAppointment,
    newPhysicalActivities: PhysicalActivity[]
    lifeHabits?: LifeHabitsInfo,
    clinicalHistory?: ClinicalHistory,
    physicalExam?: PhysicalExam
}