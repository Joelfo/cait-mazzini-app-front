import axios from 'axios';
import { Controller, FieldError, SubmitHandler, useForm } from 'react-hook-form'
import { Patient } from 'Api/Types/Patient'
import { ArrivalType } from 'Api/Types/enums/ArrivalType';
import { PatientType } from 'Api/Types/enums/PatientType';
import { SpecialPopulationType } from 'Api/Types/enums/SpecialPopulationType';
import { API_URL } from 'util/requests';
import './index.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { District } from 'Api/Types/District';
import { City } from 'Api/Types/City';
import { Country } from 'Api/Types/Country';
import { HealthUnity } from 'Api/Types/HealthUnity';
import { validate } from 'gerador-validador-cpf';
import { redirect, useNavigate } from 'react-router';
import { Alert, Button, Col, Container, Dropdown, Form, FormCheck, FormControlProps, FormGroup, Modal, Row, Spinner, Stack } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import { usePatientsStore } from 'Stores/UsePatientsStore';
import { HookControlledFormControl } from 'util/components/HookControlledFormControl';
import { justRequiredRule, requiredTextMessage } from 'util/validation';
import { EBiologicalGender } from 'Api/Types/enums/EBiologicalGender';
import { MazziniFormSection } from 'util/components/MazziniFormSection';
import { HookControlledFormSelect } from 'util/components/HookControlledFormSelect';
import { useSelectedPatient } from 'Hooks/useSelectedPatient';
import { CityAPI, useCityApi } from 'Api/useCityApi';
import { DistrictAPI, useDistrictApi } from 'Api/useDistrictApi';
import { EAddressZone } from 'Api/Types/enums/EAddressZone';
import { ViaCepAPI } from 'Api/Vendor/ViaCepAPI';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Menu, MenuItem, Typeahead, TypeaheadMenu } from 'react-bootstrap-typeahead';
import { CountryAPI, useCountryApi } from 'Api/useCountryApi';
import { FederativeUnity } from 'Api/Types/FederativeUnity';
import { FederativeUnityAPI, useFederativeUnityApi } from 'Api/useFederativeUnityApi';
import { PatientAPI } from 'Api/PatientAPI';
import { validateCns, validateCpf } from 'util/Validations';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { HealthUnityAPI, useHealthUnityApi } from 'Api/useHealthUnityApi';
import InputMask, { Props } from 'react-input-mask';
import { usePatientApi } from 'Api/usePatientApi';


export const PatientForm = () => {
    //useState
    const [ isSavingError, setIsSavingError ] = useState<boolean>(false);

    const [ checkedResponsability, setCheckedResponsability ] = useState<boolean>(false);

    const [ selectedDistrict, setSelectedDistrict ] = useState<District>();
    const [ selectedHealthUnity, setSelectedHealthUnity ] = useState<HealthUnity>();
    const [ selectedFederativeUnity, setSelectedFederativeUnity ] = useState<FederativeUnity>();
    const [ selectedCountry, setSelectedCountry ] = useState<Country>();
    const [ selectedCity, setSelectedCity ] = useState<City>();

    // useRef
    const patientHasDependenciesToSaveRef = useRef(false);

    // custom hooks
    const {
        register,
        setValue : setFormValue,
        handleSubmit: hookHandleSubmit,
        watch,
        formState : { errors },
        control,
        getValues: getFormValues
        
    } = useForm<Patient>({
        defaultValues: {
            addressZone: EAddressZone.Urban,
            type: PatientType.TB,
            biologicalGender: EBiologicalGender.Male,
        }
    });

    const watchArrivalType = watch('arrivalType');

    const cityAPI = useCityApi();
    const districtAPI = useDistrictApi(); 
    const viaCepAPI = new ViaCepAPI();
    const countryAPI = useCountryApi();
    const federativeUnityAPI = useFederativeUnityApi();
    const patientAPI = usePatientApi();
    const healthUnityAPI = useHealthUnityApi();

    const { data: cities, isLoading: isCitiesLoading } = cityAPI.useAll();

    const { data: districts, isLoading: isDistrictsLoading, isStale: isDistrictsQueryStale } = districtAPI.useAllByCity(selectedCity?.id === 0 ? undefined : selectedCity?.id);

    const { data: healthUnities, isLoading: isHealthUnitiesLoading } = healthUnityAPI.useAll();

    const watchCep = watch('cep', undefined);
    const watchDistrictId = watch('districtId');
    const watchBirthplaceId = watch('birthplaceId');


    const { data: viaCepInfo } = viaCepAPI.useViaCep(watchCep);


    const { data: countries, isLoading: isCountriesLoading } = countryAPI.useAll();

    const { data: federativeUnities, isLoading: isFederativeUnitiesLoading, isStale: isFederativeUnitiesQueryStale } = federativeUnityAPI.useAllByCountry(selectedCountry?.id === 0 ? undefined : selectedCountry?.id);

    const { mutate: savePatient, status: patientCreationStatus, data: createdPatientId } = patientAPI.useCreate();

    const { mutate: saveDistrict, status: districtCreationStatus, data: createdDistrictId } = districtAPI.useCreate();

    const { mutate: saveCity, status: cityCreationStatus } = cityAPI.useCreate();

    const { mutate: saveCountry, status: countryCreationStatus, data: createdCountryId } = countryAPI.useCreate();

    const { mutate: saveFederativeUnity, status: federativeUnityCreationStatus, data: createdFederativeUnityId } = federativeUnityAPI.useCreate();

    const { mutate: saveHealthUnity, status: healthUnityCreationStatus, data: createdHealthUnityId } = healthUnityAPI.useCreate();


    const patientToSaveRef = useRef<Patient>();

    const navigate = useNavigate();

    //useMemo
    const viaCepCityName = useMemo(() => viaCepInfo?.localidade, [viaCepInfo]);
    const viaCepDistrictName = useMemo(() => viaCepInfo?.bairro, [viaCepInfo]);

    const isSavingLoading = useMemo(() => (patientCreationStatus === 'loading' || cityCreationStatus === 'loading' || districtCreationStatus === 'loading' || countryCreationStatus === 'loading' || federativeUnityCreationStatus === 'loading' || healthUnityCreationStatus === 'loading'),
        [cityCreationStatus, districtCreationStatus, countryCreationStatus, federativeUnityCreationStatus, patientCreationStatus, healthUnityCreationStatus]);

    // callbacks
    const handleSubmit : SubmitHandler<Patient> = (patient) => {

        if (!selectedCountry || !selectedCity || !selectedDistrict || !selectedFederativeUnity) {
            return;
        }

        if (!!selectedHealthUnity) {
            patient.healthUnityId = selectedHealthUnity.id;
        }

        if (selectedDistrict.id > 0 && selectedFederativeUnity.id > 0 && (patient.arrivalType !== ArrivalType.Fowarded || selectedHealthUnity?.id !== 0)) {    
            savePatient(patient);
        } else {
            patientHasDependenciesToSaveRef.current = true;

            if (selectedCountry.id === 0) {
                saveCountry(selectedCountry, {
                    onSuccess: (id) => {
                        if (selectedFederativeUnity.id === 0) {
                            selectedFederativeUnity.countryId = id;
                            saveFederativeUnity(selectedFederativeUnity);
                        }
                    }
                })
            } else if (selectedFederativeUnity.id === 0) {
                selectedFederativeUnity.countryId = selectedCountry.id;
                saveFederativeUnity(selectedFederativeUnity);
            }
            
            if (selectedCity.id === 0) {
                saveCity(selectedCity, {
                    onSuccess: (id) => {
                        if (selectedDistrict.id === 0) {
                            selectedDistrict.cityId = id;
                            saveDistrict(selectedDistrict);
                        }
                    }
                })
            } else {
                if (selectedDistrict.id === 0) {
                    selectedDistrict.cityId = selectedCity.id;
                    saveDistrict(selectedDistrict);
                }
            }

            if (selectedHealthUnity && selectedHealthUnity.id === 0) {
                saveHealthUnity(selectedHealthUnity);
            }
        }
    }

    const handleSelectedCityChange = useCallback((selected: Option[]) => {
        if (selected.length === 0) {
            return;
        }
        const selectedCity = selected[0] as City;
        if (isNaN(selectedCity.id)) {
            selectedCity.id = 0;
        }
        setSelectedCity(selectedCity);
    }, []);

    const handleSelectedNationalityChange = useCallback((selected: Option[]) => {
        if (selected.length === 0) {
            return;
        }
        const selectedCountry = selected[0] as Country;
        if (isNaN(selectedCountry.id)) {
            selectedCountry.id = 0;
        }
        setSelectedCountry(selectedCountry);
        
    }, []);

    const handleSelectedFederativeUnityChange = useCallback((selected: Option[]) => {
        if (selected.length === 0) {
            return;
        }
        const selectedFederativeUnity = selected[0] as FederativeUnity;
        if (isNaN(selectedFederativeUnity.id)) {
            selectedFederativeUnity.id = 0;
        }
        setSelectedFederativeUnity(selectedFederativeUnity);
    }, [setFormValue, getFormValues]);

    const handleSelectedHealthUnityChange = useCallback((selected: Option[]) => {
        if (selected.length === 0) {
            return;
        }

        const selectedHealthUnity = selected[0] as HealthUnity;
        if (isNaN(selectedHealthUnity.id)) {
            selectedHealthUnity.id = 0;
        }
        setSelectedHealthUnity(selectedHealthUnity);
    }, []);

    const handleSelectedDistrictChange = useCallback((selected: Option[]) => {
        if (selected.length === 0) {
            return;
        }
        const selectedDistrict = selected[0] as District;
        setSelectedDistrict(selectedDistrict);
    }, []);

    const validateHealthUnityId = useCallback((value: number | undefined, formValues: Patient) => {
        return formValues.arrivalType !== ArrivalType.Fowarded || !!selectedHealthUnity ? true : requiredTextMessage('Unidade de saúde') }, [selectedHealthUnity]);

    // useEffect

    useEffect(() => {
        if (!!viaCepInfo) {
            setFormValue('addressStreet', viaCepInfo.logradouro);
        }
    }, [viaCepInfo]);

    useEffect(() => {
        if (!!viaCepCityName) {
            const existingCity = cities?.find(city => city.name === viaCepCityName);
            setSelectedCity(existingCity ?? { id: 0, name: viaCepCityName });
        }
    }, [viaCepCityName, cities]);

    useEffect(() => {
        if (!!viaCepDistrictName) {
            const existingDistrict = districts?.find(district => district.name === viaCepDistrictName);
            setSelectedDistrict(existingDistrict ?? { id: 0, name: viaCepDistrictName, cityId: 0 })
        }
    }, [viaCepDistrictName, districts])

    useEffect(() => {
        switch (patientCreationStatus) {
            case 'error':
                setIsSavingError(true);
                break;
            case 'loading':
                break;
        }
        
    }, [patientCreationStatus]);

    useEffect(() => {
        if (!!createdPatientId) {
            navigate('/patient?patientId=' + createdPatientId);
        }
    }, [createdPatientId])

    useEffect(() => {
        if (!!selectedDistrict) {
            setFormValue('districtId', selectedDistrict.id);
        }

    }, [selectedDistrict]);

    useEffect(() => {
        if (selectedFederativeUnity) {
            setFormValue('birthplaceId', selectedFederativeUnity.id)
        }
    }, [selectedFederativeUnity]);

    useEffect(() => {
        if (!!selectedHealthUnity) {
            setFormValue('healthUnityId', selectedHealthUnity.id);
        }
    }, [selectedHealthUnity]);

    useEffect(() => {
        if (patientHasDependenciesToSaveRef.current) {
            if ((!!createdDistrictId || (selectedDistrict?.id ?? 0) > 0) && (!!createdFederativeUnityId || (selectedFederativeUnity?.id ?? 0) > 0) && (!!createdHealthUnityId ||(selectedHealthUnity?.id ?? 1) > 0)) {
                const patient = getFormValues();
                if (!!createdDistrictId) {
                    patient.districtId = createdDistrictId;
                }
                if (!!createdFederativeUnityId) {
                    patient.birthplaceId = createdFederativeUnityId;
                }
                if (!!createdHealthUnityId) {
                    patient.healthUnityId = createdHealthUnityId;
                }
                savePatient(patient);
            }
        }
    }, [createdDistrictId, createdFederativeUnityId, createdHealthUnityId]);

    return (
        <>
        
        <Modal show={false}>
            <Modal.Body>
                <Spinner animation='border' variant='primary' />
            </Modal.Body>
        </Modal>
        <div className='container'>


            <div className='row'>
                <Form noValidate onSubmit={hookHandleSubmit(handleSubmit)}>
                    <Row className='form-mazzini-row justify-content-around'>

                        <Form.Group as={Col} md='5'>
                            <Form.Label>
                                N° do Cartão SUS
                            </Form.Label>
                            <HookControlledFormControl
                                control={control} 
                                name='susCard'
                                rules={{
                                    required: {
                                        value: true,
                                        message: requiredTextMessage('Nº do Cartão SUS')
                                    },
                                    validate: {
                                        validCns: value => validateCns(!!value ? value.toString() : '') || 'Valor de CNS inválido informado.'
                                    }
                                }} 
                                formControlType='text'
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.susCard?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md='5'>
                            <Form.Label >
                                N° do prontuário
                            </Form.Label>
                            <HookControlledFormControl control={control} name='recordCode' rules={justRequiredRule('N° do Prontuário')} formControlType='text'/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.recordCode?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Row>

                    <Row className='form-mazzini-row justify-content-around'>

                    </Row>
                    <Row className='form-mazzini-row justify-content-center'>
                        <Form.Group as={Col} md='4'>
                            <Form.Label>
                                Médico responsável
                            </Form.Label>
                            <Form.Control type='text' value='nome do medico' disabled/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row justify-content-center'>
                        <Form.Group as={Col} md='4'>
                            <Form.Label>Enfermeiro responsável</Form.Label>
                            <Form.Control type='text' disabled value='nome do enfermeiro' />
                        </Form.Group>
                    </Row>
                    <MazziniFormSection title='Entrada'>
                        <Row className='form-mazzini-row justify-content-evenly'>
                            <Col md='3'>
                                <Form.Group>
                                    <Form.Label>
                                        Data de admissão
                                    </Form.Label>
                                    <HookControlledFormControl control={control} name='admissionDate' rules={justRequiredRule('Data de admissão')} formControlType='date'/>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.admissionDate?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mt-2 d-flex flex-column justify-content-between'>
                                    <Form.Check
                                        type='radio'
                                        label='Demanda espontânea'
                                        checked={watchArrivalType === ArrivalType.SpontaneousDemand}
                                        onClick={() => setFormValue('arrivalType', ArrivalType.SpontaneousDemand)}
                                    />
                                    <Form.Check
                                        type='radio'
                                        label='Referenciado'
                                        checked={watchArrivalType === ArrivalType.Referenced}
                                        onClick={() => setFormValue('arrivalType', ArrivalType.Referenced)}
                                    />
                                    <Form.Check
                                        type='radio'
                                        label='Encaminhado'
                                        checked={watchArrivalType === ArrivalType.Fowarded}
                                        onClick={() => setFormValue('arrivalType', ArrivalType.Fowarded)}
                                    />
                                </Form.Group>
                            </Col>
                                
                            <Col md='3'>  
                                <Form.Group>
                                    <Form.Label>
                                        Tipo de paciente
                                    </Form.Label>
                                    <Controller
                                        control={control}
                                        name='type'
                                        rules={{required: { value: true, message: 'O campo tipo de paciente é obrigatório' }}}
                                        render={({
                                            field : { onChange, value },
                                            fieldState: { invalid }
                                        }) => (
                                            <>
                                            
                                                <Form.Select
                                                    onChange={(event) => {
                                                        setFormValue('type', parseInt(event.target.value))
                                                    }}
                                                    value={value}
                                                    isInvalid={invalid}
                                                >
                                                    <option value={PatientType.TB}> TB </option>
                                                    <option value={PatientType.Chemoprofilaxys}> ILTB </option>
                                                    <option value={PatientType.PNT}> PNT </option>
                                                </Form.Select>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.type?.message?.toString()}
                                                </Form.Control.Feedback>
                                            </>
                                        )}
                                    />
                                </Form.Group>
                                <Form.Group className='mt-2'>
                                    <Controller 
                                        control={control}
                                        name='isPregnant'
                                        render={({
                                            field: { value, onChange, onBlur }
                                        }) => (
                                            <Form.Check
                                                checked={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                label='Paciente gestante'
                                            />
                                        )}
                                    />
                            </Form.Group>
                            </Col>

                           
                        </Row>
                        {
                            watchArrivalType === ArrivalType.Fowarded
                            &&
                            <Row className='form-mazzini-row'>
                                <Form.Group as={Col} md='3'> 
                                    <Form.Label>Unidade de saúde</Form.Label>
                                    <Controller 
                                        name='healthUnityId'
                                        control={control}
                                        rules={{
                                            validate: {
                                                requiredWhenForwarded: validateHealthUnityId
                                            }
                                        }}
                                        render={({
                                            fieldState: { invalid }
                                        }) => (
                                            <Typeahead
                                                allowNew
                                                onChange={handleSelectedHealthUnityChange}
                                                options={healthUnities ?? []}
                                                labelKey='name'
                                                newSelectionPrefix='Novo: '
                                                renderInput={
                                                    ({
                                                        inputRef,
                                                        referenceElementRef,
                                                        value,
                                                        ...inputProps
                                                    }) => (
                                                        <>
                                                            <Form.Control
                                                               ref={(input: HTMLInputElement) => {
                                                                    inputRef(input);
                                                                    referenceElementRef(input)
                                                                }}
                                                                type='text'
                                                                value = {typeof value === 'object' ? [...value] : value}
                                                                isInvalid={invalid}
                                                                {...inputProps}
                                                                disabled={isHealthUnitiesLoading}
                                                            />
                                                            <Form.Control.Feedback type='invalid'>{requiredTextMessage('Unidade de saúde')}</Form.Control.Feedback>
                                                        </>
                                                    )
                                                }
                                            />
                                        )}
                                    />

                                    
                                </Form.Group>
                            </Row>
                        }
                    </MazziniFormSection>
                    <MazziniFormSection title='Social'>
                        <Row>
                            <Form.Group as={Col} md='5'>
                                <Form.Label>
                                    Nome
                                </Form.Label>
                                <HookControlledFormControl control={control} name='name' rules={justRequiredRule('Nome')} formControlType='text'/>
                                <Form.Control.Feedback type='invalid'>{errors.name?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='5'>
                                <Form.Label>
                                    Nome da mãe
                                </Form.Label>
                                <HookControlledFormControl control={control} name='motherName' rules={justRequiredRule('Nome da mãe')} formControlType='text'/>
                                <Form.Control.Feedback type='invalid'>{errors.motherName?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="form-mazzini-row">
                            <Form.Group as={Col} md='5'>
                                <Form.Label>
                                    RG
                                </Form.Label>
                                <Controller
                                    control={control}
                                    name='rg'
                                    rules={{
                                        required: {
                                            value: true,
                                            message: requiredTextMessage('RG')
                                        }
                                    }}
                                    render={({
                                        field: {onChange, onBlur, value},
                                        fieldState: {invalid}
                                    }) => (
                                        <Form.Control 
                                            maxLength={15}
                                            isInvalid={invalid}
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type='invalid'>{errors.rg?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='5'>
                                <Form.Label>
                                    CPF
                                </Form.Label>
                                <Controller
                                    control={control}
                                    name='cpf'
                                    rules={{
                                        required: {
                                            value: true,
                                            message: requiredTextMessage('CPF')
                                        },
                                        validate: {
                                            validCpf: value => validateCpf(!!value ? value.toString() : '') || 'Valor de Cpf inválido informado.' 
                                        }
                                    }}
                                    render={({
                                       field: { value, onChange, onBlur },
                                       fieldState: { invalid } 
                                    }) => (
                                        <><InputMask mask='999.999.999-99' onChange={onChange} value={value} onBlur={onBlur}>
                                            {
                                                ((inputProps: Props & FormControlProps) => 
                                                    { return <Form.Control {...inputProps} isInvalid={invalid}/> }) as any
                                            }
                                        </InputMask></>
                                    )}
                                />
                                <Form.Control.Feedback type='invalid'>{errors.cpf?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className='form-mazzini-row'>
                            <Form.Group as={Col} md='2'>
                                <Form.Label>
                                    Sexo
                                </Form.Label>
                                <Controller 
                                    control={control}
                                    name='biologicalGender'
                                    rules={justRequiredRule('Sexo')}
                                    render={({
                                        field: { onChange, value, onBlur },
                                        fieldState: { invalid }
                                    }) => (
                                        <>
                                        <Form.Select
                                            onChange={event => setFormValue('biologicalGender', parseInt(event.target.value))}
                                            value={value}
                                            onBlur={onBlur}
                                            isInvalid={invalid}
                                        >
                                            <option value={EBiologicalGender.Male}> Masculino </option>
                                            <option value={EBiologicalGender.Female}> Feminino </option>
                                        </Form.Select>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.biologicalGender?.message?.toString()}
                                        </Form.Control.Feedback>
                                        </>

                                    )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Form.Label>
                                    Data de nascimento
                                </Form.Label>
                                <HookControlledFormControl control={control} name='birthDate' rules={justRequiredRule('Data de nascimento')} formControlType='date'/>
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Typeahead
                                    options={countries ?? []}
                                    onChange={handleSelectedNationalityChange}
                                    allowNew
                                    newSelectionPrefix='Novo: '
                                    labelKey='name'
                                    renderInput={({
                                        inputRef,
                                        referenceElementRef,
                                        value,
                                        ...inputProps
                                    }) => (
                                        <>
                                        <Form.Label>Nacionalidade</Form.Label>
                                        <Form.Control
                                            ref={(input: HTMLInputElement) => {
                                                inputRef(input);
                                                referenceElementRef(input)
                                            }}
                                            type='text'
                                            value = {typeof value === 'object' ? [...value] : value}
                                            {...inputProps}
                                            disabled={isCountriesLoading}
                                        />
                                        </>
                                        
                                    )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Controller 
                                    control={control}
                                    name='birthplaceId'
                                    rules={{
                                        validate: value => (!!value || !!selectedFederativeUnity) || requiredTextMessage('Naturalidade (UF)')
                                    }}
                                    render={({
                                        fieldState: {invalid}
                                    }) => (
                                        <Typeahead
                                            options={federativeUnities ?? []}
                                            onChange={handleSelectedFederativeUnityChange}
                                            newSelectionPrefix='Novo'
                                            allowNew
                                            labelKey='name'
                                            renderInput={({
                                                inputRef,
                                                referenceElementRef,
                                                value,
                                                ...inputProps
                                            }) => (
                                                <>
                                                <Form.Label>Naturalidade(UF)</Form.Label>
                                                <Form.Control
                                                    ref={(input: HTMLInputElement) => {
                                                        inputRef(input);
                                                        referenceElementRef(input)
                                                    }}
                                                    isInvalid={invalid}
                                                    type='text'
                                                    value = {typeof value === 'object' ? [...value] : value}
                                                    {...inputProps}
                                                    disabled={!selectedCountry || (isFederativeUnitiesLoading && !isFederativeUnitiesQueryStale)}
                                                />
                                                <Form.Control.Feedback type='invalid'>{requiredTextMessage('Naturalidade (UF)')}</Form.Control.Feedback>
                                                </>
                                                
                                            )}
                                        />
                                    )}
                                />
                            </Form.Group>
                            {
                                        isFederativeUnitiesLoading && selectedCountry && !isFederativeUnitiesQueryStale
                                        &&
                                        <Col md='1' className='d-flex align-items-end justify-content-start'>
                                            <Spinner style={{marginBottom: '4px'}} animation='border'/>
                                        </Col>
                                        
                            }
                        </Row>
                    </MazziniFormSection>
                    <MazziniFormSection title='Contato'>
                        <Row>
                            <Form.Group as={Col} md='3'>
                                <Form.Label>Número de telefone</Form.Label>
                                <HookControlledFormControl control={control} name='telephone1' rules={justRequiredRule('Telefone')} formControlType='text' />
                                <Form.Control.Feedback type='invalid'>{errors.telephone1?.message}</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group as={Col} md='3 offset-md-1'>
                                <Form.Label>Outro número de telefone</Form.Label>
                                <HookControlledFormControl control={control} name='telephone2' rules={{}} formControlType='text' />
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    <MazziniFormSection title='Endereço'>
                        <Row>
                            <Form.Group as={Col} md='3'>
                                <Form.Label>Cep</Form.Label>
                                <InputMask mask='99999-999' {...register('cep')}>
                                    {
                                        ((inputProps: Props & FormControlProps) => 
                                            { return <Form.Control {...inputProps} isInvalid={!!errors.cep}/> }) as any
                                    }
                                </InputMask>
                                <Form.Control.Feedback type='invalid'>{errors.cep?.message}</Form.Control.Feedback>
                            </Form.Group>
                            {
                                isCitiesLoading
                                &&
                                <Col md='1' className='d-flex align-items-end justify-content-start'>
                                    <Spinner style={{marginBottom: '4px'}} animation='border'/>
                                </Col>
                            }
                        </Row>
                        <Row className='form-mazzini-row justify-content-between'>
                            <Form.Group as={Col} md='6'>
                                <Form.Label>Rua</Form.Label>
                                <HookControlledFormControl control={control} name='addressStreet' rules={justRequiredRule('Rua')} formControlType='text'/>
                                <Form.Control.Feedback type='invalid'>{errors.addressStreet?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='1'>
                                <Form.Label>Número</Form.Label>
                                <HookControlledFormControl control={control} name='addressNumber' rules={{}} formControlType='number'/>
                                <Form.Control.Feedback type='invalid'>{errors.addressNumber?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='4'>
                                <Form.Label>Complemento</Form.Label>
                                <HookControlledFormControl control={control} name='addressComplement' rules={{}} formControlType='text'/>
                            </Form.Group>
                        </Row>
                        <Row className='form-mazzini-row'>
                            <Form.Group as={Col} md='2'>
                                <Typeahead
                                    onChange={handleSelectedCityChange}
                                    labelKey='name'
                                    options={cities?.map(city => city.name) ?? []}
                                    selected={selectedCity ? [selectedCity] : []}
                                    allowNew
                                    newSelectionPrefix='Novo: '
                                    renderInput={({
                                        inputRef,
                                        referenceElementRef,
                                        value,
                                        ...inputProps
                                    }) => (
                                        <>
                                            <Form.Label>Cidade</Form.Label>
                                            <Form.Control
                                                type='text'
                                                ref={(input: HTMLInputElement) => {
                                                    inputRef(input);
                                                    referenceElementRef(input);
                                                }}
                                                value={typeof value === 'object' ? [...value] : value}
                                                {...inputProps}
                                                disabled={isCitiesLoading}
                                            />
                                        </>
                                    )}
                                />
                                <Form.Control.Feedback type='invalid'>{requiredTextMessage('Cidade')}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Stack className="d-flex flex-row">
                                    <Controller
                                        control={control}
                                        name='districtId'
                                        rules={{
                                            validate: value => (!!value || !!selectedDistrict!) || requiredTextMessage('Bairro')
                                        }}
                                        render={({
                                            fieldState: { invalid }
                                        }) => (
                                            <Typeahead 
                                                options={districts?.map(district => district.name) ?? []}
                                                onChange={handleSelectedDistrictChange}
                                                selected={selectedDistrict ? [selectedDistrict] : []}
                                                allowNew
                                                newSelectionPrefix='Novo: '
                                                labelKey='name'
                                                renderInput={({
                                                    inputRef,
                                                    referenceElementRef,
                                                    value,
                                                    ...inputProps
                                                }) => (
                                                    <>
                                                        <Form.Label>Bairro</Form.Label>
                                                        <Form.Control
                                                            type='text'
                                                            ref={(input: HTMLInputElement) => {
                                                                inputRef(input);
                                                                referenceElementRef(input);
                                                            }}
                                                            isInvalid={invalid}
                                                            value={typeof value === 'object' ? [...value] : value}
                                                            {...inputProps}
                                                            disabled={!selectedCity || (isDistrictsLoading && !isDistrictsQueryStale)}
                                                        />
                                                        <Form.Control.Feedback 
                                                            type='invalid'
                                                        >{errors.districtId?.message}</Form.Control.Feedback>
                                                    </>
                                                )}
                                            />
                                        )}
                                    />
                                    
                                </Stack>
                            </Form.Group>
                            {
                                        isDistrictsLoading && selectedCity && !isDistrictsQueryStale
                                        &&
                                        <Col md='1' className='d-flex align-items-end justify-content-start'>
                                            <Spinner style={{marginBottom: '4px'}} animation='border'/>
                                        </Col>
                                        
                            }
                            
                            <Form.Group as={Col} md='2'>
                                <Form.Label>Zona</Form.Label>
                                <HookControlledFormSelect control={control} name='addressZone' rules={justRequiredRule('Zona')}>
                                    <option value={EAddressZone.Urban} selected>Urbana</option>
                                    <option value={EAddressZone.Country}>Rural</option>
                                </HookControlledFormSelect>
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    
                    <Row className='justify-content-center form-mazzini-row'>
                            <Form.Group as={Col} className='d-flex justify-content-center'>
                                <Form.Check
                                    type='checkbox'
                                    label='Assumo responsabilidade pelo envio dos dados'
                                    checked={checkedResponsability}
                                    onChange={() => setCheckedResponsability(!checkedResponsability)}
                                    isInvalid={!checkedResponsability}
                                />
                            </Form.Group>
                    </Row>

                    <Row className='justify-content-center form-mazzini-row'>
                        <Col md='3' className='d-flex justify-content-center'>
                            <Button type='submit' variant='primary' size='lg'>
                                Salvar ficha
                            </Button>
                        </Col>
                        
                    </Row>
                    
            </Form>

            <Alert 
                show={isSavingError}
                variant='danger'
                className='fixed-top'
                dismissible
            >
                <Alert.Heading>Erro ao salvar os dados, não feche a página.</Alert.Heading>
                <p>
                    Ocorreu um erro durante o processo de salvamento dos dados enviados. Não feche ou mude de página, 
                    essa tela avisará assim que os dados terminarem de ser salvos.
                </p>
            </Alert>
            <Container className='fixed-top'>
                <Alert
                    variant='info'
                    show={isSavingLoading}
                >
                    <Alert.Heading>
                        <Spinner style={{marginRight: '15px'}} animation='border'/>
                        Salvando dados... Aguarde 
                    </Alert.Heading>
                </Alert>
            </Container>
            
            </div>
        </div>
        </>
    )
}