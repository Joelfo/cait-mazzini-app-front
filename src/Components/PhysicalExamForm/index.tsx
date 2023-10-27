import { PhysicalActivityAPI } from "Api/PhysicalActivityAPI";
import { PhysicalExamAPI } from "Api/PhysicalExamAPI";
import { SaveErrorAlert } from "Components/Utils/Alert/SaveErrorAlert";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PhysicalExam } from "types/Api/PhysicalExam";
import { QUILL_DEFAULT_MODULES } from "util/QuillDefaultModules";
import { ResponsabilityCheckbox } from "util/ResponsabilityCheckbox";
import { HookControlledFormControl } from "util/components/HookControlledFormControl";
import { HookControlledReactQuill } from "util/components/HookControlledReactQuill";
import { justRequiredRule } from "util/validation";

export const PhysicalExamForm = ({ onSubmit, onReturn = () => {}, showReturnButton = false, defaultData } : PhysicalExamFormProps) => {

    const patient = useSelectedPatient();

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
        register
    } = useForm<PhysicalExam>({
        defaultValues: defaultData ?? {}
    });

    const physicalExamAPI = new PhysicalExamAPI();
    const { mutate: savePhysicalExam, isLoading: isPhysicalExamSavingLoading, isError: isPhysicalExamSavingError, isSuccess: isPhysicalExamSaved } = physicalExamAPI.useCreate();

    //const onSubmit = (data: PhysicalExam) => savePhysicalExam({...data});

    const navigate = useNavigate();

    useEffect(() => {
        if (patient) {
            setValue('patientId', patient.id)
        }
    }, [patient])

    useEffect(() => {
        if (isPhysicalExamSaved) {
            navigate('/home?savedData=true');
        }
    }, [isPhysicalExamSaved])

    return (
        <>
            <Container fluid>
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <Form.Label>Aspecto geral e emocional*</Form.Label>
                            <HookControlledReactQuill control={control} name='generalAspect' rules={justRequiredRule('Aspecto geral e emocional')} modules={QUILL_DEFAULT_MODULES} />
                            <Form.Control.Feedback type='invalid'>{errors.generalAspect?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <Form.Label>Condições de higiene*</Form.Label>
                            <HookControlledReactQuill control={control} name='hygieneConditionsObs' rules={justRequiredRule('Condições de higiene')} modules={QUILL_DEFAULT_MODULES}/>
                            <Form.Control.Feedback type='invalid'>{errors.hygieneConditionsObs?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <Form.Label>Cabeça</Form.Label>
                            <HookControlledReactQuill control={control} name='headObs' rules={{}} modules={QUILL_DEFAULT_MODULES}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <Form.Label>Pescoço</Form.Label>
                            <HookControlledReactQuill control={control} name='neckObs' rules={{}} modules={QUILL_DEFAULT_MODULES}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <Form.Label>Abdome</Form.Label>
                            <HookControlledReactQuill control={control} name='abdomenObs' rules={{}} modules={QUILL_DEFAULT_MODULES}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <Form.Label>MMSS / MMII</Form.Label>
                            <HookControlledReactQuill control={control} name='mmssMmiiObs' rules={{}} modules={QUILL_DEFAULT_MODULES}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <Form.Label>Gênito-Urinário</Form.Label>
                            <HookControlledReactQuill control={control} name='urinaryTrackObs' rules={{}} modules={QUILL_DEFAULT_MODULES}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='10'>
                            <Form.Label>Pele e mucosa</Form.Label>
                            <HookControlledReactQuill control={control} name='skinAndMucousObs' rules={{}} modules={QUILL_DEFAULT_MODULES}/>
                        </Form.Group>
                    </Row>
                    <ResponsabilityCheckbox/>
                    <Row className='form-mazzini-row justify-content-center gx-5'>
                        {
                            showReturnButton
                            &&
                            <Col md='1'>
                                <Button variant='danger' size='lg' onClick={onReturn}> Voltar </Button>
                            </Col>
                        }
                        <Col md='1'>
                            <Button type='submit' variant='primary' size='lg'> Salvar </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
            <SaveLoadingAlert show={isPhysicalExamSavingLoading}/>
            <SaveErrorAlert show={isPhysicalExamSavingError}/>
        </>
    );
};

export type PhysicalExamFormProps = {
    onSubmit: (data: PhysicalExam) => void,
    onReturn?: () => void,
    showReturnButton?: boolean,
    defaultData?: PhysicalExam
}