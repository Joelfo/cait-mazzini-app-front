import { yupResolver } from "@hookform/resolvers/yup";
import { getValue } from "@testing-library/user-event/dist/utils";
import { ClinicalHistoryAPi, useClinicalHistoryApi } from "Api/useClinicalHistoryApi";
import { DatedImmunizationAPI, useDatedImmunizationApi } from "Api/useDatedImmunizationApi";
import { useDeseaseApi } from "Api/useDeseaseApi";
import { ImmunizationAPI, useImmunizationApi } from "Api/useImmunizationApi";
import { ConnectionErrorAlert } from "Components/Utils/Alert/ConnectionErrorAlert";
import { SaveErrorAlert } from "Components/Utils/Alert/SaveErrorAlert";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient"
import { produce } from "immer";
import { useEffect, useMemo } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClinicalHistory } from "Api/Types/ClinicalHistory";
import { ClinicalHistoryHasDatedImmunizationDTO } from "Api/Types/DTOs/ClinicalHistoryHasDatedImmunizationDTO";
import { Desease } from "Api/Types/Desease";
import { ResponsabilityCheckbox } from "util/ResponsabilityCheckbox";
import { MazziniFormSection } from "util/components/MazziniFormSection";
import { justRequiredRule } from "util/validation";
import * as yup from 'yup';

export const ClinicalHistoryForm = ({ onSubmit, onReturn, showReturnButton, defaultData } : ClinicalHistoryFormProps) => {
    const { patient, isError: isPatientError } = useSelectedPatient();

    const deseaseAPI = useDeseaseApi(); 
    const immunizationAPI = useImmunizationApi();
    const datedImmunizationAPI = useDatedImmunizationApi();
    const clinicalHistoryAPI = useClinicalHistoryApi();

    const { data: deseases, isLoading: isDeseasesLoading, isError: isDeseasesError } = deseaseAPI.useAll();
    const { data: immunizations, isLoading: isImmunizationsLoading, isError: isImmunizationsError } = immunizationAPI.useAll();
    const { data: datedImmunizations, isLoading: isDatedImmunizationsLoading, isError: isDatedImmunizationsError } = datedImmunizationAPI.useAll();
    const { mutate: saveClinicalHistory, isLoading: isSavingLoading, isError: isSavingError, isSuccess: isSaveSuccessed } = clinicalHistoryAPI.useCreate();
    
    const navigate = useNavigate();

    const searchParams = useSearchParams()[0];

    const isConnectionError = useMemo(() => isPatientError || isDeseasesError || isImmunizationsError || isDatedImmunizationsError, [isPatientError, isDeseasesError, isImmunizationsError, isDatedImmunizationsError]);

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
        register,
        watch
    } = useForm<ClinicalHistory>({
        defaultValues: defaultData ?? { 
            previousDeseaseIds: [],
            immunizationIds: [],
            datedImmunizationIds: []
        }
    });

    const datedImmunizationIdsWatch = watch('datedImmunizationIds');
    const isAlergicWatch = watch('isAlergic');
    const hasPreviousHospitalizationsWatch = watch('hasPreviousHospitalizations');
    const hasPreviousSurgeryWatch = watch('hasPreviousSurgery');

    const handleDeseaseCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        const deseaseId = parseInt(event.target.value);

        if (checked) {
            setValue('previousDeseaseIds', [...(getValues('previousDeseaseIds')), deseaseId ]);
        }
        else {
            const previousDeseaseIds = getValues('previousDeseaseIds');
            const indexToSplice = previousDeseaseIds.findIndex(id => id === deseaseId);
            previousDeseaseIds.splice(indexToSplice, 1);
            setValue('previousDeseaseIds', previousDeseaseIds);
        }
    }

    const handleImmunizationCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        const immunizationId = parseInt(event.target.value)

        if (checked) {
            setValue('immunizationIds', [...(getValues('immunizationIds')), immunizationId])
        } else {
            const immunizationIds = getValues('immunizationIds');
            const indexToSplice = immunizationIds.findIndex(id => id === immunizationId);
            immunizationIds.splice(indexToSplice, 1);
            setValue('immunizationIds', immunizationIds);
        }
    }

    const handleDatedImmunizationCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        const datedImmunizationId = parseInt(event.target.value)

        if (checked) {
            setValue('datedImmunizationIds', [...(getValues('datedImmunizationIds')), { immunizationId: datedImmunizationId, lastDoseDate: '' }])
        } else {
            const datedImmunizationIds = getValues('datedImmunizationIds');
            const indexToSplice = datedImmunizationIds.findIndex(datedImmunization => datedImmunization.immunizationId === datedImmunizationId);
            datedImmunizationIds.splice(indexToSplice, 1);
            setValue('datedImmunizationIds', datedImmunizationIds);
        }
    }

    const addDatedImmunizationDate = (datedImmunizationId: number, date: string) => {
        const clinicalHistoryHasDatedImmunizations = getValues('datedImmunizationIds')
        const index = clinicalHistoryHasDatedImmunizations.findIndex(datedImmunization => { return (datedImmunization.immunizationId == datedImmunizationId) });
        if (index >= 0) {
            setValue('datedImmunizationIds', produce(clinicalHistoryHasDatedImmunizations, clinicalHistoryHasDatedImmunizations => {
                clinicalHistoryHasDatedImmunizations[index].lastDoseDate = date;
            }))
        }
    }

    const checkIfDatedImmunizationHasValidDate = (datedImmunizationId: number) => {
        const datedImmunization = getValues('datedImmunizationIds').find(x => x.immunizationId === datedImmunizationId);
        if (!datedImmunization || !!datedImmunization.lastDoseDate) {
            return true;
        }
        else {
            return false;
        }
    }

    useEffect(() => {
        if (isSaveSuccessed)
            navigate('/Home?savedData=true');
    }, [isSaveSuccessed]);

    useEffect(() => {
        if (patient) {
            setValue('patientId', patient.id);
        }  
    }, [patient]);

    return (
        <>
            <Container fluid>
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <MazziniFormSection title='Doenças Prévias'>
                        <Row>
                            {
                                isDeseasesLoading
                                &&
                                <Col>
                                <Row>
                                    <Col md='auto'>
                                    <Spinner/>
                                    </Col>
                                    <Col>
                                        <p>Carregando doenças prévias...</p>
                                    </Col>
                                </Row>
                                </Col>
                            }
                            {
                                deseases?.map(desease => (
                                    <Form.Group as={Col} md='2' key={desease.id}>
                                        <Form.Check
                                            label={desease.name}
                                            value={desease.id}
                                            onChange={handleDeseaseCheckboxChange}
                                            key={desease.id}
                                            defaultChecked={defaultData?.previousDeseaseIds.includes(desease.id)}
                                        />
                                    </Form.Group>
                                ))
                            }
                        </Row>
                        <Row className='form-mazzini-row'>
                            <Form.Group as={Col} md='4'>
                                <Form.Label>Outras</Form.Label>
                                <Form.Control
                                    {...register('otherPreviousDeseases')}
                                    defaultValue={defaultData?.otherPreviousDeseases}
                                />
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    <MazziniFormSection title='Alergia'>
                        <Row>
                            <Form.Group as={Col} md='2' className='d-flex align-items-center'>
                                <Controller
                                    control={control}
                                    name='isAlergic'
                                    render={({
                                        field: {onChange, onBlur, value}
                                    }) => (
                                        <Form.Check
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            checked={value}
                                            label='Alérgico(a)'
                                            defaultChecked={defaultData?.isAlergic}
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4'>
                                <Form.Label>
                                    Caso alérgico(a), especificar:
                                </Form.Label>
                                <Form.Control
                                    {...register('alergyObs')}
                                    defaultValue={defaultData?.alergyObs}
                                    disabled={!isAlergicWatch}
                                />
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    <MazziniFormSection title='Cirgurgias anteriores'>
                        <Row>
                            <Form.Group as={Col}>
                                <Controller
                                    control={control}
                                    name='hasPreviousSurgery'
                                    render={({
                                        field: {onChange, onBlur, value}
                                    }) => (
                                        <Form.Check
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            checked={value}
                                            label='Possui cirurgia(s) anterior(es)'
                                            defaultChecked={defaultData?.hasPreviousSurgery}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Row>
                        <Row className='form-mazzini-row'>
                            <Form.Group as={Col} md='10'>
                                <Form.Label>Caso possua, especificar motivo(s)</Form.Label>
                                <Form.Control
                                    {...register('previousSurgeryObs')}
                                    defaultValue={defaultData?.previousSurgeryObs}
                                    disabled={!hasPreviousSurgeryWatch}
                                />
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    <MazziniFormSection title='Internações anteriores'>
                         <Row>
                            <Form.Group as={Col}>
                                <Controller
                                    control={control}
                                    name='hasPreviousHospitalizations'
                                    render={({
                                        field: {onChange, onBlur, value}
                                    }) => (
                                        <Form.Check
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            checked={value}
                                            label='Possui internação(ões) anterior(es)'
                                            defaultChecked={defaultData?.hasPreviousHospitalizations}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Row>
                        <Row className='form-mazzini-row'>
                            <Form.Group as={Col} md='10'>
                                <Form.Label>Caso possua, especificar motivo(s)</Form.Label>
                                <Form.Control
                                    {...register('previousHospitalizationsObs')}
                                    defaultValue={defaultData?.previousHospitalizationsObs}
                                    disabled={!hasPreviousHospitalizationsWatch}
                                />
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    <MazziniFormSection title='Imunização'>
                        <Row>
                            {
                                isImmunizationsLoading
                                &&
                                <Col>
                                <Row>
                                    <Col md='auto'>
                                    <Spinner/>
                                    </Col>
                                    <Col>
                                        <p>Carregando imunizações...</p>
                                    </Col>
                                </Row>
                                </Col>
                            }
                            {
                                immunizations?.map(immunization => (
                                    <Form.Group as={Col} md='2' key={immunization.id}>
                                        <Form.Check
                                            label={immunization.name}
                                            key={immunization.id}
                                            onChange={handleImmunizationCheckboxChange}
                                            value={immunization.id}
                                            defaultChecked={defaultData?.immunizationIds.includes(immunization.id)}
                                        />
                                    </Form.Group>
                                ))
                            }
                        </Row>
                        <Row className=" form-mazzini-row gx-5">
                            {
                                isDatedImmunizationsLoading
                                &&
                                <Col>
                                <Row>
                                    <Col md='auto'>
                                    <Spinner/>
                                    </Col>
                                    <Col>
                                        <p>Carregando imunizações...</p>
                                    </Col>
                                </Row>
                                </Col>
                            }
                            {
                                datedImmunizations?.map(datedImmunization => (
                                    <Form.Group as={Col} md='2' key={datedImmunization.id}>
                                        <Form.Group>
                                            <Form.Check
                                                label={datedImmunization.name}
                                                key={datedImmunization.id}
                                                onChange={handleDatedImmunizationCheckboxChange}
                                                value={datedImmunization.id}
                                                defaultChecked={!!(defaultData?.datedImmunizationIds.find(x => x.immunizationId === datedImmunization.id))}
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Ultima dose em:</Form.Label>
                                            <Form.Control 
                                                isInvalid={!!errors.datedImmunizationIds && !checkIfDatedImmunizationHasValidDate(datedImmunization.id)} 
                                                type='date'
                                                disabled={!datedImmunizationIdsWatch.find(x => x.immunizationId === datedImmunization.id)}
                                                defaultValue={defaultData?.datedImmunizationIds.find(x => x.immunizationId === datedImmunization.id)?.lastDoseDate}
                                                onChange={(event) => addDatedImmunizationDate(datedImmunization.id, event.currentTarget.value)}
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                {errors.datedImmunizationIds?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Group>
                                ))
                            }
                        </Row>
                        <Row className="form-mazzini-row">
                            <Form.Group as={Col} md='4'>
                                <Form.Label>Outros:</Form.Label>
                                <Form.Control
                                    {...register('otherImmunizations')}

                                />
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    <Row>
                        <ResponsabilityCheckbox/>
                    </Row>
                    <Row className='form-mazzini-row justify-content-center'>
                        {
                            showReturnButton
                            &&
                            <Col md='1'>
                                <Button variant='danger' size='lg' onClick={onReturn}> Voltar </Button>
                            </Col>
                        }

                        <Col md='1'>
                            <Button disabled={isSavingLoading || isConnectionError} type='submit' variant='primary' size='lg'> Salvar </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
            <SaveLoadingAlert show={isSavingLoading}/>
            <SaveErrorAlert show={isSavingError}/>
            <ConnectionErrorAlert show={isConnectionError}/>
        </>
    )
}


export type ClinicalHistoryFormProps = {
    onSubmit: (data: ClinicalHistory) => void,
    onReturn?: () => void,
    showReturnButton?: boolean,
    defaultData?: ClinicalHistory
}