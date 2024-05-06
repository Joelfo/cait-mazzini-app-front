import { yupResolver } from "@hookform/resolvers/yup";
import { ContraceptiveMethodAPI, useContraceptiveMethodApi } from "Api/useContraceptiveMethodApi";
import { LifeHabitsInfoAPI, useLifeHabitsInfoApi } from "Api/useLifeHabitsInfoApi";
import { PhysicalActivityAPI, usePhysicalActivityApi } from "Api/usePhysicalActivityApi";
import IconButton from "Components/IconButton";
import { IconButton2 } from "Components/IconButton/IconButton2";
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
import { ContraceptiveMethod } from "Api/Types/ContraceptiveMethod";
import { LifeHabitsInfoDTO } from "Api/Types/LifeHabitsInfoDTO";
import { Patient } from "Api/Types/Patient";
import { PhysicalActivity } from "Api/Types/PhysicalActivity";
import { ESexualActivityLevel } from "Api/Types/enums/ESexualActivityLevel";
import { ResponsabilityCheckbox } from "util/ResponsabilityCheckbox";
import { MazziniFormSection } from "util/components/MazziniFormSection"
import { NUMBER_MESSAGE, POSITIVE_MESSAGE, REQUIRED_MESSAGE } from "util/messages";
import { justRequiredRule, requiredTextMessage } from "util/validation";
import * as yup from 'yup';

export const LifeHabitsForm = ({ onSubmit, isSubmitLoading, onReturn = () => {}, showReturnButton = false, defaultData, onClickNewContraceptiveMethod, onClickNewPhysicalActivity, physicalActivities, 
    isPhysicalActivitiesLoading, contraceptiveMethods, patient, isContraceptiveMethodsLoading } : LifeHabitsFormProps) => {

    // form
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


    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
        register,
        watch
    } = useForm<LifeHabitsInfoDTO>({
        defaultValues: defaultData ?? {
            cigarretesPerDay: 0,
            physicalActivityIds: [],
            contraceptiveMethodIds: []
        }
    });

    // useState
    const [savedPhysicalActivitiesNumber, setSavedPhysicalActivitiesNumber] = useState<number>(0);

    const [ contraceptiveMethodsCheckboxChecked, setContraceptiveMethodsCheckboxChecked ] = useState<boolean>(!!defaultData && defaultData.contraceptiveMethodIds.length > 0);

    const selectedPhysicalActivityNames = useState<PhysicalActivity[]>([]);

    const [ selectedPhysicalActivities, setSelectedPhysicalActivities ] = useState<PhysicalActivity[]>([]);
    const [ selectedContraceptiveMethods, setSelectedContraceptiveMethods ] = useState<ContraceptiveMethod[]>([]);
    // classes
    const physicalActivityAPI = usePhysicalActivityApi();
    const contraceptiveMethodAPI = useContraceptiveMethodApi();
    const lifeHabitsInfoAPI = useLifeHabitsInfoApi();
    
    
    // custom Hooks
   

    const { mutateAsync: savePhysicalActivity } = physicalActivityAPI.useCreate();
    const {  mutateAsync: saveContraceptiveMethod } = contraceptiveMethodAPI.useCreate();
    const { status: lifeHabitsInfoSavingStatus, mutate: saveLifeHabitsInfo } = lifeHabitsInfoAPI.useCreate();

    const navigate = useNavigate();

    const watchIsSmoker = watch('isSmoker');
    const watchIsAlcoholUser = watch('isAlcoholUser');
    const watchIsFormerSmoker = watch('isFormerSmoker')
    const watchIsIllicitDrugsUser = watch('isIllicitDrugsUser');

    
    // useMemo
    const newPhysicalActivities = useMemo(() => selectedPhysicalActivities.filter(physicalActivity => {
        const id = physicalActivity.id;
        return isNaN(id) || id === 0;
    }), [selectedPhysicalActivities]);

    const existingSelectedPhysicalActivities = useMemo(() => selectedPhysicalActivities.filter(physicalActivity => !newPhysicalActivities.includes(physicalActivity)), [newPhysicalActivities, selectedPhysicalActivities]);

    const newContraceptiveMethods = useMemo(() => selectedContraceptiveMethods.filter(contraceptiveMethod => {
        const id = contraceptiveMethod.id;
        return isNaN(id) || id === 0;
    }), [selectedContraceptiveMethods]);

    const existingSelectedContraceptiveMethods = useMemo(() => selectedContraceptiveMethods.filter(contraceptiveMethod => !newContraceptiveMethods.includes(contraceptiveMethod)), [newContraceptiveMethods, selectedContraceptiveMethods]);

    // callbacks

    const handleSelectContraceptiveMethod = useCallback((selecteds: Option[]) => {
        const selectedIds = selecteds.map(selected => (selected as ContraceptiveMethod).id);
        setValue('contraceptiveMethodIds', selectedIds);
    }, [contraceptiveMethods])

    const onFormSubmit = useCallback(async (data: LifeHabitsInfoDTO) => {
        for (let i = 0; i < newPhysicalActivities.length; i++) {
            const physicalActivityId = await savePhysicalActivity(newPhysicalActivities[i]);
            data.physicalActivityIds.push(physicalActivityId);
        }

        for (let i = 0; i < newContraceptiveMethods.length; i++) {
            const contraceptiveMethodId = await saveContraceptiveMethod(newContraceptiveMethods[i]);
            data.contraceptiveMethodIds.push(contraceptiveMethodId);
        }

        data.physicalActivityIds.push(...existingSelectedPhysicalActivities.map(x => x.id));
        data.contraceptiveMethodIds.push(...existingSelectedContraceptiveMethods.map(x => x.id));

        onSubmit(data);
    }, [existingSelectedContraceptiveMethods, existingSelectedPhysicalActivities, newContraceptiveMethods, newPhysicalActivities, onSubmit, saveContraceptiveMethod, savePhysicalActivity])

    // useEffect
    useEffect(() => {
        if (lifeHabitsInfoSavingStatus === 'success') {
            navigate(`/patient?patientId=${patient!.id}&savedData=true`)
        }
    }, [lifeHabitsInfoSavingStatus]);
    
    useEffect(() => {
        if (!!patient)
            setValue('patientId', patient.id); 
    }, [patient]);

    useEffect(() => {
        console.log('----> selected physical activities <----------');
        console.log(selectedPhysicalActivities);
    }, [selectedPhysicalActivities]);

    return (
        <>
            <Container>
                <Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
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
                                <Form.Control.Feedback type='invalid'>{errors.intestinalEliminationTimesPerDay?.message}</Form.Control.Feedback>
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
                                <Form.Control.Feedback type='invalid'>{errors.bladderEliminationTimesPerDay?.message}</Form.Control.Feedback>
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
                                    disabled={!watchIsAlcoholUser}
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
                                    disabled={!watchIsSmoker}
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
                                    disabled={!watchIsFormerSmoker}
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
                                    disabled={!watchIsIllicitDrugsUser}
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
                            <Form.Group as={Col} md='5'>
                                <Form.Label>Qual(is) pratica?</Form.Label>
                                <Row gap={2}>
                                    <Col>
                                        <Stack direction="horizontal">
                                             <Typeahead
                                                id='physical-activities-typeahead'
                                                onChange={(selected) => {
                                                    setSelectedPhysicalActivities(selected.map(x => x as PhysicalActivity))
                                                }}
                                                labelKey={'name'}
                                                options={physicalActivities ?? []}
                                                selected={selectedPhysicalActivities}
                                                allowNew
                                                multiple
                                                newSelectionPrefix='Novo: '
                                                disabled={isPhysicalActivitiesLoading}
                                                />
                                            {
                                                isPhysicalActivitiesLoading 
                                                &&
                                                <Spinner/>
                                            }
                                        </Stack>

                                    </Col>
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
                                            checked={value === ESexualActivityLevel.Active}
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
                                            checked={value === ESexualActivityLevel.Eventual}
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
                                            checked={value === ESexualActivityLevel.NonExistent}
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
                                <Stack direction="horizontal">
                                    <Typeahead
                                        id='contraceptive-methods-typeahead'
                                        onChange={(selected) => {
                                            setSelectedContraceptiveMethods(selected.map(x => x as ContraceptiveMethod))
                                        }}
                                        labelKey={'name'}
                                        options={contraceptiveMethods ?? []}
                                        selected={selectedContraceptiveMethods}
                                        allowNew
                                        multiple
                                        newSelectionPrefix='Novo: '
                                        disabled={isContraceptiveMethodsLoading}
                                    />
                                </Stack>
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
                            <Button type='submit' variant='primary' size='lg' disabled={isSubmitLoading}> Salvar </Button>
                        </Col>


                    </Row>
                   
                    <SaveLoadingAlert show={isSubmitLoading}/>
                </Form>
            </Container>
        </>
    )
}

export type LifeHabitsFormProps = {
    onSubmit: (data: LifeHabitsInfoDTO) => void,
    onReturn?: () => void,
    showReturnButton? : boolean,
    defaultData?: LifeHabitsInfoDTO,
    onClickNewPhysicalActivity?: () => void,
    onClickNewContraceptiveMethod?: () => void,
    physicalActivities: PhysicalActivity[],
    isPhysicalActivitiesLoading: boolean,
    contraceptiveMethods: ContraceptiveMethod[],
    patient: Patient,
    isContraceptiveMethodsLoading: boolean,
    isSubmitLoading: boolean
};