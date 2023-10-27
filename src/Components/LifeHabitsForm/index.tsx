import { ContraceptiveMethodAPI } from "Api/ContraceptiveMethodAPI";
import { LifeHabitsInfoAPI } from "Api/LifeHabitsInfoAPI";
import { PhysicalActivityAPI } from "Api/PhysicalActivityAPI";
import { SaveErrorAlert } from "Components/Utils/Alert/SaveErrorAlert";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { produce } from "immer";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap"
import { Typeahead } from "react-bootstrap-typeahead";
import { Option } from "react-bootstrap-typeahead/types/types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ContraceptiveMethod } from "types/Api/ContraceptiveMethod";
import { LifeHabitsInfo } from "types/Api/LifeHabitsInfo";
import { PhysicalActivity } from "types/Api/PhysicalActivity";
import { ESexualActivityLevel } from "types/enums/ESexualActivityLevel";
import { ResponsabilityCheckbox } from "util/ResponsabilityCheckbox";
import { MazziniFormSection } from "util/components/MazziniFormSection"
import { justRequiredRule, requiredTextMessage } from "util/validation";
import * as yup from 'yup';

export const LifeHabitsForm = ({ onSubmit, onReturn = () => {}, showReturnButton = false, defaultData } : LifeHabitsFormProps) => {

    const schema = yup.object({
        patientId: yup.number().positive().required(),
        mealsPerDay: yup.number().positive().required(requiredTextMessage('Refeições por dia')),
        waterCupsPerDay: yup.number().positive().required(requiredTextMessage('Copos de água por dia')),
        eatingAndWaterObs: string,
        bladderEliminationsCharacteristic: string,
        bladderEliminationTimesPerDay: yup.number().positive().required(),
        hasPainOnBladderEliminations: boolean,
        intestinalEliminationsCharacteristic: string,
        intestinalEliminationTimesPerDay: yup.number().positive().required(),
        hasPainOnIntestinalEliminations: boolean,
        isAlcoholUser: boolean,
        alcoholQuantityObs: string,
        isSmoker: boolean,
        cigarretesPerDay: yup.number().positive().required(),
        isFormerSmoker: boolean,
        timeWithoutSmoking: string,
        isIllicitDrugsUser: boolean,
        illicitDrugsUsingObs: string,
        hasSatisfactorySleepingTime: boolean,
        sleepingHoursPerNight: yup.number().positive().required(),
        sleepingTimeObs: string,
        physicalActivityIds: yup.number().positive().required()[],
        physicalActivitiesObservation: string,
        physicalActivityTimesPerWeek: yup.number().positive().required(),
        leisureObservation: string,
        sexualActivityLevel: ESexualActivityLevel,
        sexualPartnersQuantity: yup.number().positive().required(),
        contraceptiveMethodIds: yup.number().positive().required()[],
        hasPrEP: boolean,
        hasPEP: boolean,
        isPreservativeUser: boolean
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
        register,
        watch
    } = useForm<LifeHabitsInfo>({
        defaultValues: defaultData ?? { 
            cigarretesPerDay: 0,
            physicalActivityIds: [],
            contraceptiveMethodIds: [],
            hasPEP: false,
            hasPrEP: false,
            isAlcoholUser: false,
            isFormerSmoker: false,
            isIllicitDrugsUser: false,
            isPreservativeUser: false,
            hasSatisfactorySleepingTime: false,
            hasPainOnBladderEliminations: false,
            hasPainOnIntestinalEliminations: false,
            isSmoker: false,
            
        }
    });

    const [savedPhysicalActivitiesNumber, setSavedPhysicalActivitiesNumber] = useState<number>(0);

    const [ contraceptiveMethodsCheckboxChecked, setContraceptiveMethodsCheckboxChecked ] = useState<boolean>(!!defaultData && defaultData.contraceptiveMethodIds.length > 0);

    const physicalActivityAPI = new PhysicalActivityAPI();

    const contraceptiveMethodAPI = new ContraceptiveMethodAPI();

    const lifeHabitsInfoAPI = new LifeHabitsInfoAPI();
    
    const { data: physicalActivities } = physicalActivityAPI.useAll();

    const { data: contraceptiveMethods } = contraceptiveMethodAPI.useAll();

    const { status: physicalActivitySavingStatus, mutate: savePhysicalActivity } = physicalActivityAPI.useCreate();

    const [ isConnectionError, setIsConnectionError ] = useState<boolean>(false);

    const [ isSavingLoading, setIsSavingLoading ] = useState<boolean>(false);

    const newPhysicalActivitiesRef = useRef<PhysicalActivity[]>([]);

    const { status: lifeHabitsInfoSavingStatus, mutate: saveLifeHabitsInfo } = lifeHabitsInfoAPI.useCreate();

    const navigate = useNavigate();
    
    const patient = useSelectedPatient();

    const watchPhysicalActivityIds = watch('physicalActivityIds');

    const selectedPhysicalActivityNames = useState<PhysicalActivity[]>([]);

    const onclickSubmit : SubmitHandler<LifeHabitsInfo> = (data) => {
        onSubmit({...data, sexualActivityLevel: parseInt(data.sexualActivityLevel.toString())}, newPhysicalActivitiesRef.current);
        /*
        data.sexualActivityLevel = parseInt(data.sexualActivityLevel.toString());
        if (newPhysicalActivitiesRef.current.length > 0) {
            setIsSavingLoading(true);
            newPhysicalActivitiesRef.current.forEach(physicalActivity => {
                savePhysicalActivity(physicalActivity, {
                    onSuccess: (id) => {
                        setValue('physicalActivityIds', [...getValues('physicalActivityIds') ?? [], id]);
                        setSavedPhysicalActivitiesNumber(current => current + 1);
                    }
                })
            })
        } else {
            setIsSavingLoading(true);
            saveLifeHabitsInfo(data);
        }*/
    };

    const handlePhysicalActivitiesInputChange = useCallback((selecteds: Option[]) => {
        const selectedEntities = selecteds.map(selected => selected as PhysicalActivity)
        newPhysicalActivitiesRef.current = selectedEntities.filter(selected => !physicalActivities?.find(physicalActivity => physicalActivity.id === selected.id));
        const filteredSelectedIds = Array.from(new Set(selectedEntities.map(entity => entity.id).filter(id => id > 0)));
        setValue('physicalActivityIds', filteredSelectedIds);
    }, [physicalActivities]);

    useEffect(() => {
        if (lifeHabitsInfoSavingStatus === 'success') {
            navigate(`/patient?patientId=${patient!.id}&savedData=true`)
        } else if (lifeHabitsInfoSavingStatus === 'error') {
            setIsSavingLoading(false);
            setIsConnectionError(true);
        }
    }, [lifeHabitsInfoSavingStatus]);

    useEffect(() => {
        if (savedPhysicalActivitiesNumber > 0 && savedPhysicalActivitiesNumber === newPhysicalActivitiesRef.current.length) {
            saveLifeHabitsInfo(getValues())
        }
    }, [savedPhysicalActivitiesNumber]);
    
    useEffect(() => {
        if (patient)
            setValue('patientId', patient.id);
    }, [patient])

    return (
        <>
            <Container>
                <Form noValidate onSubmit={handleSubmit(onclickSubmit)}>
                    <MazziniFormSection title='Alimentação e Hidratação'>
                        <Row className=''>
                            <Form.Group as={Col} md='1'>
                                <Form.Label className='text-nowrap'>Refeições por dia *</Form.Label>
                                <Form.Control 
                                    {...register('mealsPerDay', justRequiredRule('Refeições por dia'))} 
                                    isInvalid={!!errors.mealsPerDay}
                                    type='number'
                                    defaultValue={defaultData?.mealsPerDay}
                                />
                                <Form.Control.Feedback
                                    type='invalid'
                                > {errors.mealsPerDay?.message} </Form.Control.Feedback>
                                
                            </Form.Group>
                            <Form.Group as={Col} md='1' className='offset-1'>
                                <Form.Label className='text-nowrap'>Copos de água/líquido por dia *</Form.Label>
                                <Form.Control 
                                    {...register('waterCupsPerDay', justRequiredRule('Copos de água/líquido por dia'))} 
                                    isInvalid={!!errors.waterCupsPerDay}
                                    type='number'
                                    defaultValue={defaultData?.waterCupsPerDay}
                                />
                                <Form.Control.Feedback
                                    type='invalid'
                                > {errors.waterCupsPerDay?.message} </Form.Control.Feedback>
                                
                            </Form.Group>
                        </Row>
                        <Row className='form-mazzini-row '>
                            <Form.Group as={Col} md='8'>
                                <Form.Label>
                                    Observações
                                </Form.Label>
                                <Form.Control 
                                    {...register('eatingAndWaterObs')}
                                    defaultValue={defaultData?.eatingAndWaterObs}
                                />
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    <MazziniFormSection title='Eliminações'>
                        <Row className="">
                            <Col md='1'>
                                <p className='fw-bold fs-6'>Intestinais</p>
                            </Col>
                        </Row>
                        <Row className="">
                            <Form.Group
                                as={Col}
                                md='4'
                            >
                                <Form.Label>Característica *</Form.Label>
                                <Form.Control
                                    {...register('intestinalEliminationsCharacteristic', justRequiredRule('Característica'))}
                                    isInvalid={!!errors.intestinalEliminationsCharacteristic}
                                    defaultValue={defaultData?.intestinalEliminationsCharacteristic}
                                />
                                <Form.Control.Feedback
                                    type='invalid'
                                >
                                    {errors.intestinalEliminationsCharacteristic?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group 
                                as={Col}
                                md='2'
                            >
                                <Form.Label>Vezes ao dia *</Form.Label>
                                <Form.Control
                                    {...register('intestinalEliminationTimesPerDay', justRequiredRule('Vezes ao dia'))}
                                    isInvalid={!!errors.intestinalEliminationTimesPerDay}
                                    type='number'
                                    defaultValue={defaultData?.intestinalEliminationTimesPerDay}
                                />
                                <Form.Control.Feedback>{errors.intestinalEliminationTimesPerDay?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='1' className='d-flex align-items-end'>
                                <Controller
                                    name='hasPainOnIntestinalEliminations'
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value}
                                    }) => (
                                        <Form.Check 
                                            checked={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            name='intestinalPain'
                                            label='Dor'
                                            defaultChecked={defaultData?.hasPainOnIntestinalEliminations}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Row>
                        <Row className='form-mazzni-row' style={{marginTop: 20}}>
                            <Col md='1' >
                            <p className="fw-bold fs-6">Vesicais</p>
                            </Col>
                        </Row>
                        <Row className=''>
                            <Form.Group
                                as={Col}
                                md='4'
                            >
                                <Form.Label>Característica *</Form.Label>
                                <Form.Control
                                    {...register('bladderEliminationsCharacteristic', justRequiredRule('Característica'))}
                                    isValid={!!errors.physicalActivityIds}
                                    isInvalid={!!errors.bladderEliminationsCharacteristic}
                                    defaultValue={defaultData?.bladderEliminationsCharacteristic}
                                />
                                <Form.Control.Feedback
                                    type='invalid'
                                >
                                    {errors.bladderEliminationsCharacteristic?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group 
                                as={Col}
                                md='2'
                            >
                                <Form.Label>Vezes ao dia *</Form.Label>
                                <Form.Control
                                    {...register('bladderEliminationTimesPerDay', justRequiredRule('Vezes ao dia'))}
                                    isInvalid={!!errors.bladderEliminationTimesPerDay}
                                    type='number'
                                    defaultValue={defaultData?.bladderEliminationTimesPerDay}
                                />
                                <Form.Control.Feedback>{errors.bladderEliminationTimesPerDay?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='1' className='d-flex align-items-end'>
                                <Controller
                                    name='hasPainOnBladderEliminations'
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value}
                                    }) => (
                                        <Form.Check 
                                            checked={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            name='bladderPain'
                                            label='Dor'
                                            defaultChecked={defaultData?.hasPainOnBladderEliminations}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    <MazziniFormSection title='Uso de'>
                        <Row className=''>
                            <Form.Group as={Col} md='2'>
                                <Controller
                                    name='isAlcoholUser'
                                    control={control}
                                    render={({
                                        field: {value, onChange, onBlur }
                                    }) => (
                                        <Form.Check
                                            type='checkbox'
                                            checked={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label='Álcool'
                                            defaultChecked={defaultData?.isAlcoholUser}
                                        />
                                )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Form.Label>Quantidade</Form.Label>
                                <Form.Control
                                    {...register('alcoholQuantityObs')}
                                    defaultValue={defaultData?.alcoholQuantityObs}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Controller
                                    name='isSmoker'
                                    control={control}
                                    render={({
                                        field: {value, onChange, onBlur}
                                    }) => (
                                        <Form.Check
                                            name='isSmoker'
                                            checked={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label='Cigarro'
                                            defaultChecked={defaultData?.isSmoker}
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Form.Label>Quantidade</Form.Label>
                                <Form.Control
                                    {...register('cigarretesPerDay')}
                                    defaultValue={defaultData?.cigarretesPerDay}
                                />
                            </Form.Group>
                        </Row>
                        <Row className='form-mazzini-row '>
                            <Form.Group as={Col} md='2'>
                                <Controller 
                                    name='isFormerSmoker'
                                    control={control}
                                    render={({
                                        field: {value, onChange, onBlur}
                                    }) => (
                                        <Form.Check 
                                            checked={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label='Ex-tabagista'
                                            defaultChecked={defaultData?.isFormerSmoker}
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Form.Label>Quanto tempo parou</Form.Label>
                                <Form.Control
                                    {...register('timeWithoutSmoking')}
                                    defaultValue={defaultData?.timeWithoutSmoking}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Controller 
                                    name='isIllicitDrugsUser'
                                    control={control}
                                    render={({
                                        field: {value, onChange, onBlur}
                                    }) => (
                                        <Form.Check
                                            checked={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label='Drogas ilícitas'
                                            defaultChecked={defaultData?.isIllicitDrugsUser}
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Form.Label>Qual(is)</Form.Label>
                                <Form.Control 
                                    {...register('illicitDrugsUsingObs')}
                                    defaultValue={defaultData?.illicitDrugsUsingObs}
                                />
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    <MazziniFormSection title='Sono e repouso'>
                        <Row
                            className='form-mazzini-row '
                        >
                            <Form.Group as={Col} md='2'>
                                <Controller 
                                    name='hasSatisfactorySleepingTime'
                                    control={control}
                                    render={({
                                        field: {value, onChange, onBlur}
                                    }) => (
                                        <Form.Check 
                                            checked={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label='Satisfatório'
                                            defaultChecked={defaultData?.hasSatisfactorySleepingTime}
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Form.Label>Horas por noite *</Form.Label>
                                <Form.Control
                                    {...register('sleepingHoursPerNight', justRequiredRule('Horas por noite'))}
                                    isInvalid={!!errors.sleepingHoursPerNight}
                                    type='number'
                                    defaultValue={defaultData?.sleepingHoursPerNight}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.sleepingHoursPerNight?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='4'>
                                <Form.Label>Observações</Form.Label>
                                <Form.Control
                                    {...register('sleepingTimeObs')}
                                    defaultValue={defaultData?.sleepingTimeObs}
                                />
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    <MazziniFormSection title='Atividade física'>
                        <Row>
                            <Form.Group as={Col} md='3'>
                                <Form.Label>Qual(is) pratica?</Form.Label>
                                <Typeahead 
                                    multiple
                                    allowNew
                                    onChange={handlePhysicalActivitiesInputChange}
                                    labelKey='name'
                                    options={physicalActivities ?? []}
                                    defaultSelected={physicalActivities?.filter(physicalActivity => defaultData?.physicalActivityIds.includes( physicalActivity.id)) ?? []}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='1'>
                                <Form.Label className='text-nowrap'>Vezes por semana</Form.Label>
                                <Form.Control
                                    {...register('physicalActivityTimesPerWeek')}
                                    type='number'
                                    defaultValue={defaultData?.physicalActivityTimesPerWeek}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' className='offset-1'>
                                <Form.Label>Observações</Form.Label>
                                <Form.Control 
                                    {...register('physicalActivitiesObservation')}
                                    defaultValue={defaultData?.physicalActivitiesObservation}
                                />
                            </Form.Group>
                        </Row>
                        
                    </MazziniFormSection>
                    <MazziniFormSection title='Lazer'>
                        <Form.Group as={Col} md='8'>
                            <Form.Label>Observações</Form.Label>
                            <Form.Control
                                {...register('leisureObservation')}
                                defaultValue={defaultData?.leisureObservation}
                            />
                        </Form.Group>
                    </MazziniFormSection>
                    <MazziniFormSection title='Atividade sexual'>
                        <Row gap='1' className=''>
                            <Form.Group as={Col} md='2'>
                            <Controller
                                name='sexualActivityLevel'
                                control={control}
                                render={({
                                    field: { value, onBlur ,onChange }
                                }) => (
                                    <>
                                        <Form.Check
                                            type='radio'
                                            name='sexualActivityLevel'
                                            value={ESexualActivityLevel.Active}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label='Ativa'
                                            defaultChecked={defaultData?.sexualActivityLevel === ESexualActivityLevel.Active}
                                        />
                                        <Form.Check
                                            type='radio'
                                            name='sexualActivityLevel'
                                            value={ESexualActivityLevel.Eventual}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label='Eventual'
                                            defaultChecked={defaultData?.sexualActivityLevel === ESexualActivityLevel.Eventual}
                                        />  
                                        <Form.Check 
                                            type='radio'
                                            name='sexualActivityLevel'
                                            value={ESexualActivityLevel.NonExistent}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label='Inexistente'
                                            defaultChecked={defaultData?.sexualActivityLevel === ESexualActivityLevel.NonExistent}
                                        />
                                    </>
                                )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='1'>
                                <Form.Label className='text-nowrap'>Quantos parceiros(as)</Form.Label>
                                <Form.Control
                                    {...register('sexualPartnersQuantity')}
                                    defaultValue={defaultData?.sexualPartnersQuantity ?? 0}
                                    type='number'
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='3' className='offset-1 d-flex align-items-center'>
                                <Form.Check
                                    label='Método Contraceptivo'
                                    className="text-nowrap"
                                    onChange={(event) => setContraceptiveMethodsCheckboxChecked(event.currentTarget.checked)}
                                    checked={contraceptiveMethodsCheckboxChecked}
                                />
                            </Form.Group>
                            <Form.Group 
                                as={Col}
                                md='4'
                                style={{visibility: (contraceptiveMethodsCheckboxChecked) ? 'visible' : 'hidden'}}
                            >
                                <Form.Label>Qual(is)</Form.Label>
                                <Typeahead 
                                    multiple
                                    allowNew
                                    onChange={(selected) => {
                                        selected.forEach(selected => {
                                            const selectedLabel = (selected as ContraceptiveMethod).name;
                                            if (selectedLabel === '') {
                                                return;
                                            }
                                            const selectedContraceptiveMethodIndex = contraceptiveMethods?.findIndex(contraceptiveMethod => contraceptiveMethod.name === selectedLabel) ?? -1;
                                            if (selectedContraceptiveMethodIndex >= 0) {
                                                setValue('contraceptiveMethodIds', [...(getValues('contraceptiveMethodIds') ?? []), contraceptiveMethods![selectedContraceptiveMethodIndex].id ])
                                            } else {
                                                newPhysicalActivitiesRef.current.push({
                                                    name: selectedLabel,
                                                    id: 0
                                                });
                                            }
                                        })
                                    }}
                                    labelKey='name'
                                    options={contraceptiveMethods ?? []}
                                    defaultSelected={contraceptiveMethods?.filter(contraceptiveMethod => defaultData?.contraceptiveMethodIds.includes( contraceptiveMethod.id)) ?? []}
                                />
                            </Form.Group>
                        </Row>
                        <Row className='form-mazzini-row'>
                            <Form.Group as={Col} md='3'>
                                <Controller 
                                    name='isPreservativeUser'
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value}
                                    }) => (
                                        <Form.Check
                                            checked={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label='Uso de preservativo'
                                            defaultChecked={defaultData?.isPreservativeUser}
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Controller
                                    name='hasPrEP'
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value}
                                    }) => (
                                        <Form.Check
                                            checked={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label='Uso de PrEP'
                                            defaultChecked={defaultData?.hasPrEP}
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Controller
                                    name='hasPEP'
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value}
                                    }) => (
                                        <Form.Check
                                            checked={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label='Uso de PEP'
                                            defaultChecked={defaultData?.hasPEP}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
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
                   
                    <SaveLoadingAlert show={isSavingLoading}/>
                    
                    <SaveErrorAlert show={isConnectionError}/>
                   
                </Form>
            </Container>
        </>
    )
}

export type LifeHabitsFormProps = {
    onSubmit: (data: LifeHabitsInfo, newPhysicalActivities: PhysicalActivity[]) => void,
    onReturn?: () => void,
    showReturnButton? : boolean,
    defaultData?: LifeHabitsInfo
};