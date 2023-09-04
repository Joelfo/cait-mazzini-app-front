import axios from 'axios';
import { Controller, FieldError, SubmitHandler, useForm } from 'react-hook-form'
import { Patient } from 'types/Patient'
import { ArrivalType } from 'types/enums/ArrivalType';
import { PatientType } from 'types/enums/PatientType';
import { SpecialPopulationType } from 'types/enums/SpecialPopulationType';
import { API_URL } from 'util/requests';
import './index.css';
import { useEffect, useRef, useState } from 'react';
import { District } from 'types/District';
import { City } from 'types/City';
import { Country, Nationality } from 'types/Country';
import { HealthUnity } from 'types/HealthUnity';
import { validate } from 'gerador-validador-cpf';
import { redirect, useNavigate } from 'react-router';
import { Col, Container, Dropdown, Form, FormCheck, FormGroup, Modal, Row, Spinner, Stack } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import { usePatientsStore } from 'Stores/UsePatientsStore';
import { HookControlledFormControl } from 'util/components/HookControlledFormControl';
import { justRequiredRule, requiredTextMessage } from 'util/validation';
import { EBiologicalGender } from 'types/enums/EBiologicalGender';
import { MazziniFormSection } from 'util/components/MazziniFormSection';
import { HookControlledFormSelect } from 'util/components/HookControlledFormSelect';
import { usePatient } from 'Hooks/usePatient';
import { CityAPI } from 'Api/CityAPI';
import { DistrictAPI } from 'Api/DistrictAPI';
import { EAddressZone } from 'types/enums/EAddressZone';
import { ViaCepAPI } from 'Api/Vendor/ViaCepAPI';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Typeahead } from 'react-bootstrap-typeahead';
import { CountryAPI } from 'Api/CountryAPI';


export const PatientForm = () => {
    /*
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [nationalities, setNationalities] = useState<Nationality[]>([]);
    const [healthUnities, setHealthUnities] = useState<HealthUnity[]>([]);
    const [searchHealthUnities, setSearchHealthUnities] = useState<boolean>(false);
    const [patient, setPatient] = useState<Patient | null>();

    //const [searchParams, setSearchParams] = useSearchParams();
    const selectedPatientId = usePatientsStore((state) => state.selectedPatientId);
    const {
        register,
        setValue : setFormValue,
        handleSubmit,
        watch,
        formState : { errors },
        control,
        getValues
        
    } = useForm<Patient>({
        defaultValues: async () => {
            if (selectedPatientId) {
                const response = await axios.get(`${API_URL}/patients/${selectedPatientId}`);
                setPatient(response.data);
                const district = (await axios.get<District>(`${API_URL}/districts/${response.data.district.id}`)).data;
                setSelectedCityId(district.city.id);
                setShowLoadingModal(false);
                return {...response.data}
            } else {
                setShowLoadingModal(false);
                return { isPregnant: false }
            }
            
        }
    });
    useEffect(() => console.log(errors), [errors]);
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const modalRef = useRef<HTMLDivElement | null>(null);
    const [showLoadingModal, setShowLoadingModal] = useState<boolean>(true);
    

    const districtInputRef = useRef<HTMLSelectElement | null>(null);
    //const {ref: districtReactHookRef, ...districtRegister } = register('district.id');
    const otherSpecialPopulationInputContainerRef = useRef<HTMLDivElement | null>(null);
    const healthUnityInputContainerRef = useRef<HTMLDivElement | null>(null);

    const onSubmit: SubmitHandler<Patient> = data => {
        setShowLoadingModal(true);
        
        axios.post(
            `${API_URL}/patients`,
            {
                ...data
            }
        ).then((response) => {
            setShowLoadingModal(false);
           navigate('/Home');
        }).catch(() => {
            window.alert('Ocorreu um erro, verifique os campos digitados');
            setShowLoadingModal(false);
        })
    };

    const onChangeCity : React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        axios.get<District[]>(
            `${API_URL}/cities/${event.target.value}/districts`
        ).then((response) => {
            setDistricts(response.data);
        })
    };

    useEffect(() => {
        if (selectedCityId) {
            axios.get<District[]>(
                `${API_URL}/cities/${selectedCityId}/districts`
            ).then((response) => {
                setDistricts(response.data);
            })
        }
       
    }, [selectedCityId])

    const watchSpecialPopulation = watch('specialPopulation');
    const watchArrival = watch('arrival');

    useEffect(() => {
        axios.get(
            `${API_URL}/cities/all`
        ).then((response) => {
            setCities(response.data);
        });

        axios.get(
            `${API_URL}/nationalities/all`
        ).then(response => {
            setNationalities(response.data);
        })
    }, []);

    useEffect(() => {
        if (districtInputRef.current != null && cities.length > 0) {
            districtInputRef.current.disabled = false;
        }
    }, [cities])

    useEffect(() => {
        if (otherSpecialPopulationInputContainerRef.current) {
            if (watchSpecialPopulation === SpecialPopulationType.Other) {
                otherSpecialPopulationInputContainerRef.current.classList.remove('d-none');
            }
            else {
                otherSpecialPopulationInputContainerRef.current.classList.add('d-none');
            }
        }
    }, [watchSpecialPopulation]);

    useEffect(() => {
        if (healthUnityInputContainerRef.current) {
            if (watchArrival === ArrivalType.Fowarded){
                healthUnityInputContainerRef.current.classList.remove('d-none');
                setSearchHealthUnities(true);
            }
            else {
                healthUnityInputContainerRef.current.classList.add('d-none');
                setFormValue('healthUnity', undefined);
            }
        }
    }, [watchArrival])

    useEffect(() => {
        axios.get(
            `${API_URL}/healthUnities/all`
        ).then(response => {
            setHealthUnities(response.data);
        })
    }, [searchHealthUnities])*/

    const selectedPatient = usePatient();

    const {
        register,
        setValue : setFormValue,
        handleSubmit,
        watch,
        formState : { errors },
        control,
        getValues
        
    } = useForm<Patient>();

    const watchArrivalType = watch('arrival');

    const cityAPI = new CityAPI();
    const districtAPI = new DistrictAPI(); 
    const viaCepAPI = new ViaCepAPI();
    const countryAPI = new CountryAPI();

    const { data: cities } = cityAPI.useAll();

    const [ selectedCityId, setSelectedCityId ] = useState<number>();

    const { data: districts, isLoading: isDistrictsLoading, isStale } = districtAPI.useAllByCity(selectedCityId);

    const newCityRef = useRef<City>();
    const newDistrictRef = useRef<District>();
    const newCountryRef = useRef<Country>();
    
    const watchCep = watch('cep', undefined);

    const { data: viaCepInfo } = viaCepAPI.useViaCep(watchCep);

    const [ selectedCityName, setSelectedCityName ] = useState<string>();
    const [ selectedDistrictName, setSelectedDistrictName ] = useState<string>();
    const [ selectedCountryName, setSelectedCountryName ] = useState<string>();

    const { data: countries } = countryAPI.useAll();
    
    /*useEffect(() => {
        if (!viaCepInfo) {
            return;
        }
        setFormValue()
    })*/

    useEffect(() => {
        if (!selectedCityName || selectedCityName === '') {
            return;
        }
        const city = cities?.find(city => city.name === selectedCityName);
        setSelectedDistrictName('');
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
            return;
        }
        const district = districts?.find(district => district.name === selectedDistrictName);
        if (!!district) {
            setFormValue('districtId', district.id ?? 0);
            newDistrictRef.current = undefined;
        } else {
            newDistrictRef.current = {
                name: selectedDistrictName,
                cityId: selectedCityId ?? 0
            }
        }
    }, [selectedDistrictName, districts])

    useEffect(() => {
        if (!selectedCountryName || selectedCountryName === '') {
            return;
        }
        const country = countries?.find(country => country.name === selectedCountryName);
        if (!!country) {
            setFormValue('birthCountryId', country.id);
            newCountryRef.current = null;
        } else {
            newCountryRef.current = {
                name: selectedCountryName
            }
        }
    })

    useEffect(() => {
        if (viaCepInfo) {
            setFormValue('addressStreet', viaCepInfo.logradouro);
            setSelectedCityName(viaCepInfo.localidade);
            setSelectedDistrictName(viaCepInfo.bairro);
        }
        
    }, [viaCepInfo]);

    return (
        <>
        
        <Modal show={false}>
            <Modal.Body>
                <Spinner animation='border' variant='primary' />
            </Modal.Body>
        </Modal>
        <div className='container'>
        
            <div className='col'>
                {
                    Object.keys(errors).map((key, index) => {
                        const errorsKey = key as keyof typeof errors;
                        if (errors[errorsKey] && errors[errorsKey]?.message && errors[errorsKey]?.message != ''){
                            return (
                                <div className='alert alert-danger  fade show' role='alert' key={index}>
                                        {errors[errorsKey]?.message}                        
                                </div>
                            );
                        }
                    })
                }
            </div>

            <div className='row'>
                <Form>
                    <Row className='form-mazzini-row justify-content-around'>

                        <Form.Group as={Col} md='5'>
                            <Form.Label>
                                N° do Cartão SUS
                            </Form.Label>
                            <HookControlledFormControl control={control} name='susCard' rules={justRequiredRule('N° do Cartão SUS')} formControlType='text'/>
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
                                    <HookControlledFormControl control={control} name='admissionDate' rules={justRequiredRule('Data de admissão')} formControlType='text'/>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.admissionDate?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mt-2 d-flex flex-column justify-content-between'>
                                    <Form.Check
                                        type='radio'
                                        label='Demanda espontânea'
                                        checked={watchArrivalType === ArrivalType.SpontaneousDemand}
                                        onClick={() => setFormValue('arrival', ArrivalType.SpontaneousDemand)}
                                    />
                                    <Form.Check
                                        type='radio'
                                        label='Referenciado'
                                        checked={watchArrivalType === ArrivalType.Referenced}
                                        onClick={() => setFormValue('arrival', ArrivalType.Referenced)}
                                    />
                                    <Form.Check
                                        type='radio'
                                        label='Encaminhado'
                                        checked={watchArrivalType === ArrivalType.Fowarded}
                                        onClick={() => setFormValue('arrival', ArrivalType.Fowarded)}
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
                                                    {errors.arrival?.message}
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
                        <Row clasName="form-mazzini-row">
                            <Form.Group as={Col} md='5'>
                                <Form.Label>
                                    Nome
                                </Form.Label>
                                <HookControlledFormControl control={control} name='name' rules={justRequiredRule('Nome')} formControlType='text'/>
                            </Form.Group>
                            <Form.Group as={Col} md='5'>
                                <Form.Label>
                                    Nome da mãe
                                </Form.Label>
                                <HookControlledFormControl control={control} name='motherName' rules={justRequiredRule('Nome da mãe')} formControlType='text'/>
                            </Form.Group>
                        </Row>
                        <Row clasName="form-mazzini-row">
                            <Form.Group as={Col} md='5'>
                                <Form.Label>
                                    RG
                                </Form.Label>
                                <HookControlledFormControl control={control} name='rg' rules={justRequiredRule('RG')} formControlType='text'/>
                            </Form.Group>
                            <Form.Group as={Col} md='5'>
                                <Form.Label>
                                    CPF
                                </Form.Label>
                                <HookControlledFormControl control={control} name='cpf' rules={justRequiredRule('CPF')} formControlType='text'/>
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
                                            {errors.biologicalGender?.message}
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
                                <Form.Label>Nacionalidade (País)</Form.Label>
                                <Typeahead 
                                    options={countries?.map(country => country.name) ?? new Array() as Country[]}
                                    onChange={selected => setSelectedCountryName(selected[0] as string)}
                                    allowNew
                                    selected={selectedCountryName ? [selectedCountryName] : []}
                                    isInvalid={!!errors.birthCountryId}
                                />
                                <Form.Control.Feedback>{requiredTextMessage('Nacionalidade (País)')}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    <MazziniFormSection title='Contato'>
                        <Row>
                            <Form.Group as={Col} md='3'>
                                <Form.Label>Número de telefone</Form.Label>
                                <HookControlledFormControl control={control} name='telephone1' rules={justRequiredRule('Telefone')} formControlType='text' />
                                <Form.Control.Feedback>{errors.telephone1?.message}</Form.Control.Feedback>
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
                            </Form.Group>
                        </Row>
                        <Row className='form-mazzini-row justify-content-between'>
                            <Form.Group as={Col} md='6'>
                                <Form.Label>Rua</Form.Label>
                                <HookControlledFormControl control={control} name='addressStreet' rules={justRequiredRule('Rua')} formControlType='text'/>
                                <Form.Control.Feedback>{errors.addressStreet?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='1'>
                                <Form.Label>Número</Form.Label>
                                <HookControlledFormControl control={control} name='addressNumber' rules={{}} formControlType='number'/>
                                <Form.Control.Feedback>{errors.addressNumber?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='4'>
                                <Form.Label>Complemento</Form.Label>
                                <HookControlledFormControl control={control} name='addressComplement' rules={justRequiredRule('Complemento')} formControlType='text'/>
                                <Form.Control.Feedback>{errors.addressComplement?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className='form-mazzini-row'>
                            <Form.Group as={Col} md='2'>
                                <Form.Label>Cidade</Form.Label>
                                <Typeahead
                                    onChange={(selected) => setSelectedCityName(selected[0] as string)}
                                    options={cities?.map(city => city.name) ?? []}
                                    selected={selectedCityName ? [selectedCityName] : []}
                                    allowNew
                                />
                                <Form.Control.Feedback>{requiredTextMessage('Cidade')}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Form.Label> Bairro </Form.Label>
                                <Stack className="d-flex flex-row">
                                    <Typeahead 
                                        options={districts?.map(district => district.name) ?? []}
                                        allowNew
                                        isInvalid={!!errors.districtId}
                                        onChange={(selected) => setSelectedDistrictName(selected[0] as string)}
                                        selected={selectedDistrictName ? [selectedDistrictName] : []}
                                        disabled={isDistrictsLoading}
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
                                    <option value={EAddressZone.Urban}>Urbana</option>
                                    <option value={EAddressZone.Country}>Rural</option>
                                </HookControlledFormSelect>
                            </Form.Group>
                        </Row>
                    </MazziniFormSection>
                    
                    
            </Form>
            { /*
                <form className='col' onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}>

                    <div className='row form-section justify-content-between'>
                        <div className='form-group col-md-5'>
                            <label className='form-label' htmlFor='susCard'>Nº do Cartão do SUS</label>
                            <input className='form-control' id='susCard' 
                                {...register('susCard', { 
                                    required: true, 
                                    maxLength: { value: 11, message: 'O nº do cartão deve ter no máximo 11 caracteres' }, 
                                    minLength: { value:8, message: 'O nº do cartão deve ter no mínimo 8 caracteres' }})}/>
                        </div>
                        <div className='form-group col-md-5'>
                            <label className='form-label' htmlFor='recordCode'>Nº do Prontuário</label>
                            <input className='form-control' id='recordCode' {...register('recordCode', {required: true})}/>
                        </div>
                    </div>
                        

                    <div className='row form-section justify-content-evenly'>
                        <div className='form-group col-md-4'>
                            <div>
                                <label className='form-label' htmlFor='admissionDate'>Data de Admissão</label>
                                <input id='admissionDate' className='form-control' {...register('admissionDate', { required: true })}/>
                            </div>
                            <div>
                                <div className='form-check'>
                                    <input className='form-check-input' type='radio' id={'opt-' + ArrivalType.Fowarded} value={ArrivalType.Fowarded} {...register('arrival')}/>
                                    <label className='form-check-label' htmlFor={'opt-' + ArrivalType.Fowarded} > {ArrivalType.Fowarded}</label>
                                </div>
                                <div className='form-check'>
                                    <input className='form-check-input' type='radio' id={'opt-' + ArrivalType.Referenced} value={ArrivalType.Referenced} {...register('arrival')}/>
                                    <label className='form-check-label' htmlFor={'opt-' + ArrivalType.Referenced} > {ArrivalType.Referenced}</label>
                                </div>
                                <div className='form-check'>
                                    <input className='form-check-input' type='radio' id={'opt-' + ArrivalType.SpontaneousDemand} value={ArrivalType.SpontaneousDemand} {...register('arrival')}/>
                                    <label className='form-check-label' htmlFor={'opt-' + ArrivalType.SpontaneousDemand} > {ArrivalType.SpontaneousDemand}</label>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-4 form-group'>
                            <label className='form-label' htmlFor='type'>Tipo de Paciente</label>
                            <select className='form-select' id='type' {...register('type')}>
                                <option value={PatientType.TB}>
                                    {PatientType.TB}
                                </option>
                                <option value={PatientType.PNT}>
                                    {PatientType.PNT}
                                </option>
                                <option value={PatientType.Chemoprofilaxys}>
                                    {PatientType.Chemoprofilaxys}
                                </option>
                            </select>
                            <div className='d-none' ref={healthUnityInputContainerRef}>
                                <label className='form-label' htmlFor='healthUnity'>
                                    Unidade de saúde
                                </label>
                                <select id='healthUnity' className='form-select' {...register('healthUnity.id')}>
                                    {
                                        healthUnities.map(healthUnity => (
                                            <option value={healthUnity.id} key={healthUnity.id} selected={healthUnity.id === patient?.healthUnity?.id}>
                                                {healthUnity.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div> 
                    </div>

                    <div className='row form-section justify-content-between'>
                        <div className='form-group col-md-6'>
                            <label className='form-label' htmlFor='name'>Nome</label>
                            <input id='name' className='form-control' {...register('name', { required: true})}/>
                        </div>
                        <div className='form-group col-md-6'>
                            <label className='form-label' htmlFor='motherName'>Nome da mãe</label>
                            <input id='motherName' className='form-control' {...register('motherName', {required: true})}/>
                        </div>
                    </div>
                    
                    <div className='row form-section justify-content-between'>
                        <div className='form-group col-md-6'>
                            <label className='form-label' htmlFor='rg'>RG</label>
                            <input id='rg' className='form-control' {...register('rg', { required: true, maxLength: {value: 11, message: 'O campo RG deve ter no máximo 8 caracteres'}, minLength: {value: 8, message:'O campo RG deve ter no minomo 11 caracteres'}})}/>
                        </div>
                        <div className='form-group col-md-6'>
                            <label className='form-label' htmlFor='cpf'>CPF</label>
                            <input id='cpf' className='form-control' {...register('cpf', { required: true, maxLength:{ value: 11, message:'O campo cpf deve ter 11 caracteres'}, minLength: {value: 11, message:'O campo cpf deve ter 11 caracteres'}, validate: { validate } })}/>
                        </div>
                    </div>

                    <div className='row form-section justify-content-evenly'>
                        <div className='form-group col-md-3'>
                            <label className='form-label' htmlFor='biologicalGender'>Sexo</label>
                            <select className='form-select' id='biologicalGender' {...register('biologicalGender', {required: true})}>
                                <option value='Masculino'>Masculino</option>
                                <option value='Feminino'>Feminino</option>
                            </select>
                        </div>

                        <div className='form-group col-md-3'>
                            <label className='form-label' htmlFor='birthDate'>Data de nascimento</label>
                            <input id='birthDate' className='form-control' {...register('birthDate', {required: true})}/>
                        </div>
                    </div>
                    
                    <div className='row form-section justify-content-evenly'>
                        <div className='form-group col-md-3'>
                            <label className='form-label' htmlFor='telephone1'>Número de telefone</label>
                            <input id='telephone1' className='form-control' {...register('telephone1', { required: true })}/>
                        </div>

                        <div className='form-group col-md-3'>
                            <label className='form-label' htmlFor='telephone2'>Outro número de telefone</label>
                            <input id='telephone2' className='form-control'  {...register('telephone2')}/>
                        </div>
                    </div>

                    <div className='row form-section justify-content-center'>
                        <div className='form-group col-md-4'>
                        <label className='form-label' htmlFor='cep'>Cep</label>
                            <input id='cep' className='form-control'  {...register('cep', { required: true })}/>
                        </div>
                    </div>

                    <div className='row form-section justify-content-evenly'>
                        <div className='form-group col-md-6'>
                            <label className='form-label' htmlFor='street'>Logradouro</label>
                            <input id='street' className='form-control' {...register('street', { required: true })}/>
                        </div>

                        <div className='form-group col-md-2'>
                            <label className='form-label' htmlFor='number'>Número</label>
                            <input id='number' className='form-control'  {...register('number', { required: true })}/>
                        </div>

                        <div className='form-group col-md-4'>
                            <label className='form-label' htmlFor='complement'>Complemento</label>
                            <input id='complement' className='form-control'  {...register('complement')}/>
                        </div>
                    </div>
                    

                    <div className='row form-section justify-content-evenly'>
                        <div className='form-group col-md-3 pregnant-input-group'>
                            <input id='isPregnant' className='form-check-input pregnant-checkbox' type='checkbox' {...register('isPregnant')}/>
                            <label className='form-check-label' htmlFor='isPregnant'>Paciente gestante</label>
                        </div>
                        <div className='form-group col-md-3'>
                            <label className='form-label' htmlFor='specialPopulation'> População especial </label>
                            <select id='specialPopulation' className='form-select' {...register('specialPopulation')}>
                                <option value={SpecialPopulationType.None}>
                                    {SpecialPopulationType.None}
                                </option>
                                <option value={SpecialPopulationType.Homeless}>
                                    {SpecialPopulationType.Homeless}
                                </option>
                                <option value={SpecialPopulationType.HealthProfessional}>
                                    {SpecialPopulationType.HealthProfessional}
                                </option>
                                <option value={SpecialPopulationType.Immigrant}>
                                    {SpecialPopulationType.Immigrant}
                                </option>
                                <option value={SpecialPopulationType.Prisoner}>
                                    {SpecialPopulationType.Prisoner}
                                </option>
                                <option value={SpecialPopulationType.Other}>
                                    {SpecialPopulationType.Other}
                                </option>
                            </select>
                        </div>
                        <div className='form-group col-md-3 d-none' ref={otherSpecialPopulationInputContainerRef}>
                            <label className='form-label' htmlFor='otherSpecialPopulation'>
                                População Especial
                            </label>
                            <input className='form-control' id='otherSpecialPopulation' {...register('otherSpecialPopulation')}></input>
                        </div>
                    </div>

                    <div className='row form-section justify-content-evenly'>
                        <div className='form-group col-md-3'>
                            <label className='form-label' htmlFor='city'>
                                Cidade
                            </label>
                            <select className='form-select' id='city' value={selectedCityId} onChange={event => setSelectedCityId(parseInt(event.target.value))}>
                                {
                                    cities
                                    &&
                                    cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='form-group col-md-3'>
                            <label className='form-label' htmlFor='district'>
                                Bairro
                            </label>
                            <select className='form-select' id='district' disabled {...districtRegister} ref={(e) => {
                                districtReactHookRef(e);
                                districtInputRef.current = e;
                            }}>
                                {
                                    districts
                                    &&
                                    districts.map((district) => (
                                        <option key={district.id} value={district.id} selected={district.id === patient?.district.id}>
                                            {district.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='form-group col-md-3'>
                            <label className='form-label' htmlFor='nationality'>
                                Nacionalidade
                            </label>
                            <select className='form-select' id='nationality' {...register('nationality.id', { required: true })}>
                                {
                                    nationalities
                                    &&
                                    nationalities.map((nationality) => (
                                        <option key={nationality.id} value={nationality.id}>
                                            {nationality.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='form-group col-md-3'>
                                <label className='form-label' htmlFor='birthplace'>
                                    Naturalidade
                                </label>
                                <input className='form-control' id='birthplace' {...register('birthplace', {required: true})}/>
                        </div>
                    </div>
                    <div className='row form-section justify-content-center'>
                        <div className='col-md-8 form-group d-flex justify-content-center align-items-center mt-5'>
                            <input id='responsabilityValidation' className='form-check-input pregnant-checkbox' type='checkbox'/>
                            <label className='form-check-label' htmlFor='responsabilityValidation'>Assumo responsabilidade pelo envio dos dados</label>
                        </div>
                    </div>
                    <div className='row form-section justify-content-center'>
                        <div className='form-group col-md-3'>
                            <button type='submit' className='btn btn-primary w-100'>Enviar</button>
                        </div>
                    </div>
                </form>
                            */}
            </div>
        </div>
        </>
    )
}