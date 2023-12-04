import { yupResolver } from "@hookform/resolvers/yup";
import { ContraceptiveMethodAPI } from "Api/ContraceptiveMethodAPI";
import { LifeHabitsInfoAPI } from "Api/LifeHabitsInfoAPI";
import { PhysicalActivityAPI } from "Api/PhysicalActivityAPI";
import { ConnectionErrorAlert } from "Components/Utils/Alert/ConnectionErrorAlert";
import { SaveErrorAlert } from "Components/Utils/Alert/SaveErrorAlert";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient";
import { produce } from "immer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Spinner, Stack } from "react-bootstrap"
import { Typeahead } from "react-bootstrap-typeahead";
import { Option } from "react-bootstrap-typeahead/types/types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ContraceptiveMethod } from "types/Api/ContraceptiveMethod";
import { LifeHabitsInfoDTO } from "types/Api/LifeHabitsInfoDTO";
import { PhysicalActivity } from "types/Api/PhysicalActivity";
import { ESexualActivityLevel } from "types/enums/ESexualActivityLevel";
import { ResponsabilityCheckbox } from "util/ResponsabilityCheckbox";
import { MazziniFormSection } from "util/components/MazziniFormSection"
import { NUMBER_MESSAGE, POSITIVE_MESSAGE, REQUIRED_MESSAGE } from "util/messages";
import { justRequiredRule, requiredTextMessage } from "util/validation";
import * as yup from 'yup';

export const LifeHabitsForm = ({ onSubmit, onReturn = () => {}, showReturnButton = false, defaultData } : LifeHabitsFormProps) => {

    const labels = {
        mealsPerDay: 'Refeições por dia',
        waterCupsPerDay: 'Copos d\'água por dia',
        eatingAndWaterObs: 'Observações',
        bladderEliminationsCharacteristic: 'Característica',
        bladderEliminationTimesPerDay: 'Vezes ao dia',
        hasPainOnBladderEliminations: 'Dor',
        intestinalEliminationsCharacteristic: 'Característica',
        intestinalEliminationTimesPerDay: 'Vezes ao dia',
        hasPainOnIntestinalEliminations: 'Dor',
        isAlcoholUser: 'Álcool',
        alcoholQuantityObs: 'Quantidade por dia',
        isSmoker: 'Cigarro',
        cigarretesPerDay: 'Cigarros por dia',
        isFormerSmoker: 'Ex-tabagista',
        timeWithoutSmoking: 'Tempo que parou',
        isIllicitDrugsUser: 'Drogas ílicitas',
        illicitDrugsUsingObs: 'Qual(is) droga(s)',
        hasSatisfactorySleepingTime: 'Satisfatório',
        sleepingHoursPerNight: 'Horas por noite',
        sleepingTimeObs: 'Observações',
        physicalActivityIds: 'Qual(is)',
        physicalActivitiesObservation: 'Observações',
        physicalActivityTimesPerWeek: 'Vezes por semana',
        leisureObservation: 'Observações',
        sexualPartnersQuantity: 'Quantidade de parceiros(as)',
        contraceptiveMethodIds: 'Qual(is)',
        hasPrEP: 'PrEP',
        hasPEP: 'PEP',
        isPreservativeUser: 'Utiliza preservativo',
        sexualActivityLevel: 'Nível de atividade sexual'
    }

    const schema : yup.ObjectSchema<LifeHabitsInfoDTO> = yup.object({
        patientId: yup.number().min(1).defined(),
        mealsPerDay: yup.number().typeError(NUMBER_MESSAGE).min(0).defined().label(labels.mealsPerDay),
        waterCupsPerDay: yup.number().typeError(NUMBER_MESSAGE).min(0).required().label(labels.waterCupsPerDay),
        eatingAndWaterObs: yup.string(),
        bladderEliminationsCharacteristic: yup.string().required().label(labels.bladderEliminationsCharacteristic),
        bladderEliminationTimesPerDay: yup.number().typeError(NUMBER_MESSAGE).min(0).required().label(labels.bladderEliminationTimesPerDay),
        hasPainOnBladderEliminations: yup.boolean().required().default(false),
        intestinalEliminationsCharacteristic: yup.string().required().label(labels.intestinalEliminationsCharacteristic),
        intestinalEliminationTimesPerDay: yup.number().typeError(NUMBER_MESSAGE).positive(POSITIVE_MESSAGE).required().label(labels.intestinalEliminationTimesPerDay),
        hasPainOnIntestinalEliminations: yup.boolean().required().default(false).label(labels.hasPainOnIntestinalEliminations),
        isAlcoholUser: yup.boolean().required().default(false),
        alcoholQuantityObs: yup.string(),
        isSmoker: yup.boolean().required().default(false),
        cigarretesPerDay: yup.number().min(0).required(),
        isFormerSmoker: yup.boolean().required().default(false),
        timeWithoutSmoking: yup.string(),
        isIllicitDrugsUser: yup.boolean().required().default(false),
        illicitDrugsUsingObs: yup.string(),
        hasSatisfactorySleepingTime: yup.boolean().required().default(false),
        sleepingHoursPerNight: yup.number().typeError(NUMBER_MESSAGE).positive(POSITIVE_MESSAGE).required().label(labels.sleepingHoursPerNight),
        sleepingTimeObs: yup.string(),
        physicalActivityIds: yup.array(yup.number().required()).required().default([]),
        physicalActivitiesObservation: yup.string(),
        physicalActivityTimesPerWeek: yup.number().min(0).required().default(0),
        leisureObservation: yup.string(),
        sexualActivityLevel: yup.mixed<ESexualActivityLevel>().oneOf<ESexualActivityLevel>(Object.values(ESexualActivityLevel) as ESexualActivityLevel[]).required().label(labels.sexualActivityLevel).default(defaultData?.sexualActivityLevel),
        sexualPartnersQuantity: yup.number().min(0).required(),
        contraceptiveMethodIds: yup.array(yup.number().required()).required().default([]),
        hasPrEP: yup.boolean().required().default(false),
        hasPEP: yup.boolean().required().default(false),
        isPreservativeUser: yup.boolean().required().default(false)
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
        register,
        watch
    } = useForm<LifeHabitsInfoDTO>({
        resolver: yupResolver(schema)
    });

    const [savedPhysicalActivitiesNumber, setSavedPhysicalActivitiesNumber] = useState<number>(0);

    const [ contraceptiveMethodsCheckboxChecked, setContraceptiveMethodsCheckboxChecked ] = useState<boolean>(!!defaultData && defaultData.contraceptiveMethodIds.length > 0);

    const physicalActivityAPI = new PhysicalActivityAPI();

    const contraceptiveMethodAPI = new ContraceptiveMethodAPI();

    const lifeHabitsInfoAPI = new LifeHabitsInfoAPI();
    
    const { data: physicalActivities, isLoading: isPhysicalActivitiesLoading, isError: isPhysicalActivitiesError } = physicalActivityAPI.useAll();

    const { data: contraceptiveMethods, isLoading: isContraceptiveMethodsLoading, isError: isContraceptiveMethodsError } = contraceptiveMethodAPI.useAll();

    const { status: physicalActivitySavingStatus, mutate: savePhysicalActivity } = physicalActivityAPI.useCreate();

    const { patient, isError: isPatientError } = useSelectedPatient();

    const isConnectionError = useMemo(() => (isPatientError || isContraceptiveMethodsError || isPhysicalActivitiesError), [isPatientError, isContraceptiveMethodsError, isPhysicalActivitiesError])

    const [ isSavingLoading, setIsSavingLoading ] = useState<boolean>(false);

    const newPhysicalActivitiesRef = useRef<PhysicalActivity[]>([]);

    const { status: lifeHabitsInfoSavingStatus, mutate: saveLifeHabitsInfo } = lifeHabitsInfoAPI.useCreate();

    const navigate = useNavigate();


    const watchPhysicalActivityIds = watch('physicalActivityIds');

    const selectedPhysicalActivityNames = useState<PhysicalActivity[]>([]);

    const onclickSubmit : SubmitHandler<LifeHabitsInfoDTO> = (data) => {
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
        }
    }, [lifeHabitsInfoSavingStatus]);

    useEffect(() => {
        if (savedPhysicalActivitiesNumber > 0 && savedPhysicalActivitiesNumber === newPhysicalActivitiesRef.current.length) {
            saveLifeHabitsInfo(getValues())
        }
    }, [savedPhysicalActivitiesNumber]);
    
    useEffect(() => {
        if (!!patient)
            setValue('patientId', patient.id); 
    }, [patient])

    return (
        <>
            <Container>
                <Form noValidate onSubmit={handleSubmit(onclickSubmit)}>
                    <MazziniFormSection title='Alimentação e Hidratação'>
                        <Row className=''>
                            <Form.Group as={Col} md='1'>
                                <Form.Label className='text-nowrap'>{labels.mealsPerDay} *</Form.Label>
                                <Form.Control 
                                    
                                    {...register('mealsPerDay')} 
                                    isInvalid={!!errors.mealsPerDay}
                                    type='number'
                                    defaultValue={defaultData?.mealsPerDay}
                                />
                                <Form.Control.Feedback
                                    type='invalid'
                                > {errors.mealsPerDay?.message} </Form.Control.Feedback>
                                
                            </Form.Group>
                            <Form.Group as={Col} md='1' className='offset-1'>
                                <Form.Label className='text-nowrap'>{labels.waterCupsPerDay}*</Form.Label>
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
                                    {labels.eatingAndWaterObs}
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
                                <Form.Label>{labels.mealsPerDay} *</Form.Label>
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
                                <Form.Label>Cigarros por dia</Form.Label>
                                <Form.Control
                                    
                                    {...register('cigarretesPerDay')}
                                    defaultValue={defaultData?.cigarretesPerDay ?? 0}
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
                            <Form.Group as={Col} md='4'>
                                <Form.Label>Qual(is) pratica?</Form.Label>
                                <Row gap={2}>
                                    <Col>
                                        <Typeahead
                                            multiple
                                            allowNew
                                            onChange={handlePhysicalActivitiesInputChange}
                                            labelKey='name'
                                            options={physicalActivities ?? []}
                                            disabled={isPhysicalActivitiesLoading}
                                            defaultSelected={physicalActivities?.filter(physicalActivity => defaultData?.physicalActivityIds.includes( physicalActivity.id)) ?? []}
                                            placeholder="Deixar em branco caso nenhuma"
                                        />
                                    </Col>
                                    {
                                        isPhysicalActivitiesLoading 
                                        &&
                                        <Col>
                                            <Spinner size='sm'/> 
                                        </Col>
                                    }
                                </Row>
                               
                            </Form.Group>
                            <Form.Group as={Col} md='1'>
                                <Form.Label className='text-nowrap'>Vezes por semana</Form.Label>
                                <Form.Control
                                    
                                    {...register('physicalActivityTimesPerWeek')}
                                    type='number'
                                    defaultValue={defaultData?.physicalActivityTimesPerWeek ?? 0}
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
                                <Form.Label>{labels.sexualActivityLevel}</Form.Label>
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
                                            onChange={() => setValue('sexualActivityLevel', ESexualActivityLevel.Active)}
                                            onBlur={onBlur}
                                            label='Ativa'
                                            defaultChecked={defaultData?.sexualActivityLevel === ESexualActivityLevel.Active}
                                            isInvalid={!!errors.sexualActivityLevel}
                                        />
                                        <Form.Check
                                            
                                            type='radio'
                                            name='sexualActivityLevel'
                                            value={ESexualActivityLevel.Eventual}
                                            onChange={() => setValue('sexualActivityLevel', ESexualActivityLevel.Eventual)}
                                            onBlur={onBlur}
                                            label='Eventual'
                                            defaultChecked={defaultData?.sexualActivityLevel === ESexualActivityLevel.Eventual}
                                            isInvalid={!!errors.sexualActivityLevel}
                                        />  
                                        <Form.Check
                                             
                                            type='radio'
                                            name='sexualActivityLevel'
                                            value={ESexualActivityLevel.NonExistent}
                                            onChange={() => setValue('sexualActivityLevel', ESexualActivityLevel.NonExistent)}
                                            onBlur={onBlur}
                                            label='Inexistente'
                                            defaultChecked={defaultData?.sexualActivityLevel === ESexualActivityLevel.NonExistent}
                                            isInvalid={!!errors.sexualActivityLevel}
                                        />
                                    </>
                                )}
                            />
                            <Form.Control 
                                 
                                style={{display: 'none'}} 
                                isInvalid={!!errors.sexualActivityLevel}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.sexualActivityLevel?.message}
                            </Form.Control.Feedback>
                            

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
                    <ConnectionErrorAlert show={isConnectionError}/>
                   
                </Form>
            </Container>
        </>
    )
}

export type LifeHabitsFormProps = {
    onSubmit: (data: LifeHabitsInfoDTO, newPhysicalActivities: PhysicalActivity[]) => void,
    onReturn?: () => void,
    showReturnButton? : boolean,
    defaultData?: LifeHabitsInfoDTO
};