import axios from 'axios';
import { Controller, FieldError, SubmitHandler, useForm } from 'react-hook-form'
import { Patient } from 'types/Api/Patient'
import { ArrivalType } from 'types/enums/ArrivalType';
import { PatientType } from 'types/enums/PatientType';
import { SpecialPopulationType } from 'types/enums/SpecialPopulationType';
import { API_URL } from 'util/requests';
import './index.css';
import { useEffect, useRef, useState } from 'react';
import { District } from 'types/Api/District';
import { City } from 'types/Api/City';
import { Country } from 'types/Api/Country';
import { HealthUnity } from 'types/Api/HealthUnity';
import { validate } from 'gerador-validador-cpf';
import { redirect, useNavigate } from 'react-router';
import { Alert, Button, Col, Container, Dropdown, Form, FormCheck, FormGroup, Modal, Row, Spinner, Stack } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import { usePatientsStore } from 'Stores/UsePatientsStore';
import { HookControlledFormControl } from 'util/components/HookControlledFormControl';
import { justRequiredRule, requiredTextMessage } from 'util/validation';
import { EBiologicalGender } from 'types/enums/EBiologicalGender';
import { MazziniFormSection } from 'util/components/MazziniFormSection';
import { HookControlledFormSelect } from 'util/components/HookControlledFormSelect';
import { useSelectedPatient } from 'Hooks/useSelectedPatient';
import { CityAPI } from 'Api/CityAPI';
import { DistrictAPI } from 'Api/DistrictAPI';
import { EAddressZone } from 'types/enums/EAddressZone';
import { ViaCepAPI } from 'Api/Vendor/ViaCepAPI';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Typeahead } from 'react-bootstrap-typeahead';
import { CountryAPI } from 'Api/CountryAPI';
import { FederativeUnity } from 'types/Api/FederativeUnity';
import { FederativeUnityAPI } from 'Api/FederativeUnityAPI';
import { PatientAPI } from 'Api/PatientAPI';
import { validateCns, validateCpf } from 'util/Validations';
import { Option } from 'react-bootstrap-typeahead/types/types';

export const PatientForm = () => {
    const selectedPatient = useSelectedPatient();

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

    const cityAPI = new CityAPI();
    const districtAPI = new DistrictAPI(); 
    const viaCepAPI = new ViaCepAPI();
    const countryAPI = new CountryAPI();
    const federativeUnityAPI = new FederativeUnityAPI();
    const patientAPI = new PatientAPI();

    const { data: cities } = cityAPI.useAll();

    const [ selectedCityId, setSelectedCityId ] = useState<number>();

    const { data: districts, isLoading: isDistrictsLoading, isStale } = districtAPI.useAllByCity(selectedCityId);

    const newCityRef = useRef<City>();
    const [ newDistrict, setNewDistrict ] = useState<District>();
    const [ newCountry, setNewCountry ] = useState<Country>();
    const [ newFederativeUnity, setNewFederativeUnity ] = useState<FederativeUnity>();
    
    const watchCep = watch('cep', undefined);

    const { data: viaCepInfo } = viaCepAPI.useViaCep(watchCep);

    const watchCountryId = watch('birthCountryId');

    const [ selectedCityName, setSelectedCityName ] = useState<string>();
    const [ selectedDistrictName, setSelectedDistrictName ] = useState<string>();
    const [ selectedCountryName, setSelectedCountryName ] = useState<string>();
    const [ selectedFederativeUnityName, setSelectedFederativeUnityName ] = useState<string>();

    const { data: countries } = countryAPI.useAll();

    const { data: federativeUnities } = federativeUnityAPI.useAllByCountry(watchCountryId);

    const { mutate: savePatient, status: patientCreationStatus, data: createdPatientId } = patientAPI.useCreate();

    const { mutate: saveDistrict, status: districtCreationStatus, data: createdDistrictId } = districtAPI.useCreate();

    const { mutate: saveCity, status: cityCreationStatus } = cityAPI.useCreate();

    const { mutate: saveCountry, status: countryCreationStatus, data: createdCountryId } = countryAPI.useCreate();

    const { mutate: saveFederativeUnity, status: federativeUnityCreationStatus, data: createdFederativeUnityId } = federativeUnityAPI.useCreate();

    const [ isSavingLoading, setIsSavingLoading ] = useState<boolean>(false);

    const [ isSavingError, setIsSavingError ] = useState<boolean>(false);

    const [ checkedResponsability, setCheckedResponsability ] = useState<boolean>(false);

    const watchDistrictId = watch('districtId');
    const watchFederativeUnityId = watch('birthplaceId');

    const patientToSaveRef = useRef<Patient>();

    const handleSubmit : SubmitHandler<Patient> = (value) => {
        value.biologicalGender = parseInt(value.biologicalGender.toString());
        value.type = parseInt(value.type.toString());
        value.arrivalType = parseInt(value.arrivalType.toString());

        if (!newCityRef.current && !newCityRef.current && !newDistrict && !newFederativeUnity) {
            savePatient(value);
            return;
        }
        patientToSaveRef.current = value;

        if (newCityRef.current) {
            saveCity(newCityRef.current)
        }
        if (!!newDistrict && !newCityRef.current) {
            saveDistrict(newDistrict);
        }
        if (!!newCountry) {
            saveCountry(newCountry, );
        }
        if (!!newFederativeUnity && !newCountry) {
            saveFederativeUnity(newFederativeUnity);
        }
    }

    const trySavingPatient = () => {
        if (
            (cityCreationStatus === 'success' || !newCityRef.current) &&
            (districtCreationStatus === 'success' || !newDistrict) &&
            (countryCreationStatus === 'success' || !newCountry) &&
            (federativeUnityCreationStatus === 'success' || !newFederativeUnity)
        ) {
            if (patientToSaveRef.current) {
                savePatient(patientToSaveRef.current);
            }
        }
    };

    useEffect(() => {
        if (cityCreationStatus === 'error' || districtCreationStatus === 'error' || countryCreationStatus === 'error' || federativeUnityCreationStatus === 'error') {
            setIsSavingError(true)
        } else {
            setIsSavingError(false);
        }

        if (cityCreationStatus === 'loading' || districtCreationStatus === 'loading' || countryCreationStatus === 'loading' || federativeUnityCreationStatus === 'error') {
            setIsSavingLoading(true);
        } else {
            setIsSavingLoading(false);
        }

        if (cityCreationStatus === 'success' || districtCreationStatus === 'success' || countryCreationStatus === 'success' || federativeUnityCreationStatus === 'success') {
            trySavingPatient();
        }
    }, [cityCreationStatus, districtCreationStatus, countryCreationStatus, federativeUnityCreationStatus]);

    useEffect(() => {
        if (cityCreationStatus === 'success' && !!newDistrict) {
            saveDistrict(newDistrict);
        }
    }, [cityCreationStatus]);

    useEffect(() => {
        if (countryCreationStatus === 'success' && !!newFederativeUnity) {
            saveFederativeUnity(newFederativeUnity);
        }
    }, [countryCreationStatus]);

    useEffect(() => {
        if (createdFederativeUnityId && patientToSaveRef.current) {
            patientToSaveRef.current.birthplaceId = createdFederativeUnityId;
        }
    }, [createdFederativeUnityId]);

    useEffect(() => {
        if (createdCountryId && patientToSaveRef.current) {
            patientToSaveRef.current.birthCountryId = createdCountryId;
        } 
    }, [createdCountryId]);

    useEffect(() => {
        if (createdDistrictId && patientToSaveRef.current) {
            patientToSaveRef.current.districtId = createdDistrictId;
        }
    })


    useEffect(() => {
        if (!selectedCityName || selectedCityName === '') {
            newCityRef.current = undefined;
            return;
        }
        const city = cities?.find(city => city.name === selectedCityName);
        
        if (city) {
            setSelectedCityId(city.id ?? 0);
            newCityRef.current = undefined;
        } else {
            newCityRef.current = {
                name: selectedCityName
            }
        }
    }, [selectedCityName, cities]);

    useEffect(() => {
        if (!selectedDistrictName || selectedDistrictName === '') {
            setNewDistrict(undefined);
            return;
        }
        const district = districts?.find(district => district.name === selectedDistrictName);
        if (!!district) {
            setFormValue('districtId', district.id ?? 0);
            setNewDistrict(undefined);
        } else {
            setNewDistrict({
                name: selectedDistrictName,
                cityId: selectedCityId ?? 0
            });
            setFormValue('districtId', 0);
        }
    }, [selectedDistrictName, districts])

    useEffect(() => {
        if (!selectedCountryName || selectedCountryName === '') {
            setNewCountry(undefined);
            return;
        }
        const country = countries?.find(country => country.name === selectedCountryName);
        if (!!country ) {
            setFormValue('birthCountryId', country.id);
            setNewCountry(undefined);
        } else {
            setNewCountry({
                id: 0,
                name: selectedCountryName
            });
            setFormValue('birthCountryId', 0);
        }
    }, [selectedCountryName]);

    useEffect(() => {
        if (!selectedFederativeUnityName || selectedFederativeUnityName === '') {
            setNewFederativeUnity(undefined)
            return;
        }
        const FederativeUnity = federativeUnities?.find(FederativeUnity => FederativeUnity.name === selectedFederativeUnityName);
        if (!!FederativeUnity) {
            setFormValue('birthplaceId', FederativeUnity.id);
            setNewFederativeUnity(undefined);
        } else {
            setNewFederativeUnity({
                id: 0,
                name: selectedFederativeUnityName,
                countryId: getFormValues('birthCountryId')
            });
            setFormValue('birthplaceId', 0);
        }

    }, [selectedFederativeUnityName])

    useEffect(() => {
        if (viaCepInfo) {
            setFormValue('addressStreet', viaCepInfo.logradouro);
            setSelectedCityName(viaCepInfo.localidade);
            setSelectedDistrictName(viaCepInfo.bairro);
        }
        
    }, [viaCepInfo]);

    useEffect(() => {
        switch (patientCreationStatus) {
            case 'success':
                redirect('/Home?savedData=true');
                break;
            case 'error':
                setIsSavingError(true);
                break;
            case 'loading':
                setIsSavingLoading(true);
                break;
        }
        
    }, [patientCreationStatus])

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
                                                    onChange={onChange}
                                                    value={value}
                                                    isInvalid={invalid}
                                                >
                                                    <option value={PatientType.TB}> TB </option>
                                                    <option value={PatientType.Chemoprofilaxys}> Quimioprofilaxia </option>
                                                    <option value={PatientType.PNT}> PNT </option>
                                                </Form.Select>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.type?.message?.toString()}
                                                </Form.Control.Feedback>
                                            </>
                                        )}
                                    />
                                </Form.Group>
                                <FormGroup className='mt-2'>
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
                            </FormGroup>
                            </Col>

                           
                        </Row>
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
                                            type='number'
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
                                        maxLength: {
                                            value: 11,
                                            message: 'O campo CPF não deve ser maior do que 11 caracteres'
                                        },
                                        validate: {
                                            validCpf: value => validateCpf(!!value ? value.toString() : '') || 'Valor de Cpf inválido informado.' 
                                        }
                                    }}
                                    render={({
                                       field: { value, onChange, onBlur },
                                       fieldState: { invalid } 
                                    }) => (
                                        <Form.Control 
                                            value={value} 
                                            onChange={onChange} 
                                            onBlur={onBlur}
                                            isInvalid={invalid}
                                            type='number'
                                        />
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
                                            onChange={onChange}
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
                                <Controller
                                    control={control}
                                    name='birthCountryId'
                                    rules={justRequiredRule('Nacionalidade (País)')}
                                    render={({
                                        fieldState: {invalid}
                                    }) => (
                                        <Typeahead
                                            options={countries?.map(country => country.name) ?? new Array() as string[]}
                                            onChange={selected => {
                                                const value = !!selected[0] ? (selected[0] as Record<string, any>)['label'] ?? selected[0] as string : '';
                                                if (!!value || value === '') {
                                                    setSelectedCountryName(value as string);
                                                }
                                            }
                                            }
                                            allowNew
                                            selected={!!selectedCountryName ? [{ label: selectedCountryName } ] : []}
                                            renderInput={({
                                                inputRef,
                                                referenceElementRef,
                                                value,
                                                ...inputProps
                                            }) => (
                                                <>
                                                    <Form.Label>Nacionalidade (País)</Form.Label>
                                                    <Form.Control 
                                                        ref={(input: HTMLInputElement) => {
                                                            inputRef(input);
                                                            referenceElementRef(input);
                                                        }}
                                                        isInvalid={!newCountry && !!errors.birthCountryId}
                                                        type='text'
                                                        value={typeof value === 'object' ? [...value] : value}
                                                        {...inputProps}
                                                    />
                                                    <Form.Control.Feedback type='invalid'>{errors.birthCountryId?.message}</Form.Control.Feedback>
                                                </>
                                            )}
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Controller 
                                    control={control}
                                    name='birthplaceId'
                                    rules={{
                                        validate: value => (!!value || !!newFederativeUnity) || requiredTextMessage('Naturalidade (UF)')
                                    }}
                                    render={({
                                        fieldState: {invalid}
                                    }) => (
                                        <Typeahead
                                            options={federativeUnities?.map(federativeUnity => federativeUnity.name) ?? new Array() as FederativeUnity[]}
                                            onChange={selected => {
                                                    const value = !!selected[0] ? (selected[0] as Record<string, any>)['label'] ?? selected[0] as string : '';
                                                    if (!!value || value === '') {
                                                        setSelectedFederativeUnityName(value as string);
                                                    }
                                                }
                                            }
                                            allowNew
                                            selected = {!!selectedFederativeUnityName ? [selectedFederativeUnityName] : []}
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
                                                    isInvalid={!newFederativeUnity && !!errors.birthplaceId}
                                                    type='text'
                                                    value = {typeof value === 'object' ? [...value] : value}
                                                    {...inputProps}
                                                />
                                                <Form.Control.Feedback type='invalid'>{requiredTextMessage('Naturalidade (UF)')}</Form.Control.Feedback>
                                                </>
                                                
                                            )}
                                        />
                                    )}
                                />
                            </Form.Group>
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
                                <HookControlledFormControl control={control} name='cep' rules={justRequiredRule('Cep')} formControlType='text' />
                                <Form.Control.Feedback type='invalid'>{errors.cep?.message}</Form.Control.Feedback>
                            </Form.Group>
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
                                <Form.Label>Cidade</Form.Label>
                                <Typeahead
                                    onChange={selected => {
                                        const value = !!selected[0] ? (selected[0] as Record<string, any>)['label'] ?? selected[0] as string : '';
                                        if (!!value || value === '') {
                                            setSelectedCityName(value as string);
                                        }
                                    }
                                }
                                    options={cities?.map(city => city.name) ?? []}
                                    selected={!!selectedCityName ? [selectedCityName] : []}
                                    allowNew
                                />
                                <Form.Control.Feedback type='invalid'>{requiredTextMessage('Cidade')}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Stack className="d-flex flex-row">
                                    <Controller
                                        control={control}
                                        name='districtId'
                                        rules={justRequiredRule('Bairro')}
                                        render={({
                                            fieldState: { invalid }
                                        }) => (
                                            <Typeahead 
                                                options={districts?.map(district => district.name) ?? []}
                                                onChange={selected => {
                                                    const value = !!selected[0] ? (selected[0] as Record<string, any>)['label'] ?? selected[0] as string : '';
                                                    if (!!value || value === '') {
                                                        setSelectedDistrictName(value as string);
                                                    }
                                                }
                                            }
                                                allowNew
                                                selected={!!selectedDistrictName ? [selectedDistrictName] : []}  
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
                                                            isInvalid={!newDistrict && !!errors.districtId}
                                                            value={typeof value === 'object' ? [...value] : value}
                                                            {...inputProps}
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
                                        isDistrictsLoading && selectedCityId
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