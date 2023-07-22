import axios from "axios";
import { FieldError, SubmitHandler, useForm } from "react-hook-form"
import { Patient } from "types/Patient"
import { ArrivalType } from "types/enums/ArrivalType";
import { PatientType } from "types/enums/PatientType";
import { SpecialPopulationType } from "types/enums/SpecialPopulationType";
import { API_URL } from "util/requests";
import './index.css';
import { useEffect, useRef, useState } from "react";
import { District } from "types/District";
import { City } from "types/City";
import { Nationality } from "types/Nationality";
import { HealthUnity } from "types/HealthUnity";
import { validate } from "gerador-validador-cpf";
import { redirect, useNavigate } from "react-router";
import { Modal, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";


export const PatientForm = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [nationalities, setNationalities] = useState<Nationality[]>([]);
    const [healthUnities, setHealthUnities] = useState<HealthUnity[]>([]);
    const [searchHealthUnities, setSearchHealthUnities] = useState<boolean>(false);
    const [patient, setPatient] = useState<Patient | null>();

    let { patientId } = useParams();

    const {
        register,
        setValue : setFormValue,
        handleSubmit,
        watch,
        formState : { errors },
    } = useForm<Patient>({
        defaultValues: async () => {
            if (patientId) {
                const response = await axios.get(`${API_URL}/patients/${patientId}`);
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
    const {ref: districtReactHookRef, ...districtRegister } = register("district.id");
    const otherSpecialPopulationInputContainerRef = useRef<HTMLDivElement | null>(null);
    const healthUnityInputContainerRef = useRef<HTMLDivElement | null>(null);
    const [selectedCityId, setSelectedCityId] = useState<number>();

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
            window.alert("Ocorreu um erro, verifique os campos digitados");
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

    const watchSpecialPopulation = watch("specialPopulation");
    const watchArrival = watch("arrival");

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
                otherSpecialPopulationInputContainerRef.current.classList.remove("d-none");
            }
            else {
                otherSpecialPopulationInputContainerRef.current.classList.add("d-none");
            }
        }
    }, [watchSpecialPopulation]);

    useEffect(() => {
        if (healthUnityInputContainerRef.current) {
            if (watchArrival === ArrivalType.Fowarded){
                healthUnityInputContainerRef.current.classList.remove("d-none");
                setSearchHealthUnities(true);
            }
            else {
                healthUnityInputContainerRef.current.classList.add("d-none");
                setFormValue("healthUnity", undefined);
            }
        }
    }, [watchArrival])

    useEffect(() => {
        axios.get(
            `${API_URL}/healthUnities/all`
        ).then(response => {
            setHealthUnities(response.data);
        })
    }, [searchHealthUnities])
    return (
        <>
        
        <Modal show={showLoadingModal}>
            <Modal.Body>
                <Spinner animation="border" variant="primary" />
            </Modal.Body>
        </Modal>
        <div className="container">
        
            <div className="col">
                {
                    Object.keys(errors).map((key, index) => {
                        const errorsKey = key as keyof typeof errors;
                        if (errors[errorsKey] && errors[errorsKey]?.message && errors[errorsKey]?.message != ""){
                            return (
                                <div className="alert alert-danger  fade show" role="alert" key={index}>
                                        {errors[errorsKey]?.message}                        
                                </div>
                            );
                        }
                    })
                }
            </div>

            <div className="row">
                <form className="col" onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}>

                    <div className="row form-section justify-content-between">
                        <div className="form-group col-md-5">
                            <label className="form-label" htmlFor="susCard">Nº do Cartão do SUS</label>
                            <input className="form-control" id="susCard" 
                                {...register("susCard", { 
                                    required: true, 
                                    maxLength: { value: 11, message: "O nº do cartão deve ter no máximo 11 caracteres" }, 
                                    minLength: { value:8, message: "O nº do cartão deve ter no mínimo 8 caracteres" }})}/>
                        </div>
                        <div className="form-group col-md-5">
                            <label className="form-label" htmlFor="recordCode">Nº do Prontuário</label>
                            <input className="form-control" id="recordCode" {...register("recordCode", {required: true})}/>
                        </div>
                    </div>

                    <div className="row form-section justify-content-evenly">
                        <div className="form-group col-md-4">
                            <div>
                                <label className="form-label" htmlFor="admissionDate">Data de Admissão</label>
                                <input id="admissionDate" className="form-control" {...register("admissionDate", { required: true })}/>
                            </div>
                            <div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" id={'opt-' + ArrivalType.Fowarded} value={ArrivalType.Fowarded} {...register("arrival")}/>
                                    <label className="form-check-label" htmlFor={'opt-' + ArrivalType.Fowarded} > {ArrivalType.Fowarded}</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" id={'opt-' + ArrivalType.Referenced} value={ArrivalType.Referenced} {...register("arrival")}/>
                                    <label className="form-check-label" htmlFor={'opt-' + ArrivalType.Referenced} > {ArrivalType.Referenced}</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" id={'opt-' + ArrivalType.SpontaneousDemand} value={ArrivalType.SpontaneousDemand} {...register("arrival")}/>
                                    <label className="form-check-label" htmlFor={'opt-' + ArrivalType.SpontaneousDemand} > {ArrivalType.SpontaneousDemand}</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 form-group">
                            <label className="form-label" htmlFor="type">Tipo de Paciente</label>
                            <select className="form-select" id="type" {...register("type")}>
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
                            <div className="d-none" ref={healthUnityInputContainerRef}>
                                <label className="form-label" htmlFor="healthUnity">
                                    Unidade de saúde
                                </label>
                                <select id="healthUnity" className="form-select" {...register("healthUnity.id")}>
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

                    <div className="row form-section justify-content-between">
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="name">Nome</label>
                            <input id="name" className="form-control" {...register("name", { required: true})}/>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="motherName">Nome da mãe</label>
                            <input id="motherName" className="form-control" {...register("motherName", {required: true})}/>
                        </div>
                    </div>
                    
                    <div className="row form-section justify-content-between">
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="rg">RG</label>
                            <input id="rg" className="form-control" {...register("rg", { required: true, maxLength: {value: 11, message: "O campo RG deve ter no máximo 8 caracteres"}, minLength: {value: 8, message:"O campo RG deve ter no minomo 11 caracteres"}})}/>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="cpf">CPF</label>
                            <input id="cpf" className="form-control" {...register("cpf", { required: true, maxLength:{ value: 11, message:"O campo cpf deve ter 11 caracteres"}, minLength: {value: 11, message:"O campo cpf deve ter 11 caracteres"}, validate: { validate } })}/>
                        </div>
                    </div>

                    <div className="row form-section justify-content-evenly">
                        <div className="form-group col-md-3">
                            <label className="form-label" htmlFor="biologicalGender">Sexo</label>
                            <select className="form-select" id="biologicalGender" {...register("biologicalGender", {required: true})}>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                        </div>

                        <div className="form-group col-md-3">
                            <label className="form-label" htmlFor="birthDate">Data de nascimento</label>
                            <input id="birthDate" className="form-control" {...register("birthDate", {required: true})}/>
                        </div>
                    </div>
                    
                    <div className="row form-section justify-content-evenly">
                        <div className="form-group col-md-3">
                            <label className="form-label" htmlFor="telephone1">Número de telefone</label>
                            <input id="telephone1" className="form-control" {...register("telephone1", { required: true })}/>
                        </div>

                        <div className="form-group col-md-3">
                            <label className="form-label" htmlFor="telephone2">Outro número de telefone</label>
                            <input id="telephone2" className="form-control"  {...register("telephone2")}/>
                        </div>
                    </div>

                    <div className="row form-section justify-content-center">
                        <div className="form-group col-md-4">
                        <label className="form-label" htmlFor="cep">Cep</label>
                            <input id="cep" className="form-control"  {...register("cep", { required: true })}/>
                        </div>
                    </div>

                    <div className="row form-section justify-content-evenly">
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="street">Logradouro</label>
                            <input id="street" className="form-control" {...register("street", { required: true })}/>
                        </div>

                        <div className="form-group col-md-2">
                            <label className="form-label" htmlFor="number">Número</label>
                            <input id="number" className="form-control"  {...register("number", { required: true })}/>
                        </div>

                        <div className="form-group col-md-4">
                            <label className="form-label" htmlFor="complement">Complemento</label>
                            <input id="complement" className="form-control"  {...register("complement")}/>
                        </div>
                    </div>
                    

                    <div className="row form-section justify-content-evenly">
                        <div className="form-group col-md-3 pregnant-input-group">
                            <input id="isPregnant" className="form-check-input pregnant-checkbox" type="checkbox" {...register("isPregnant")}/>
                            <label className="form-check-label" htmlFor="isPregnant">Paciente gestante</label>
                        </div>
                        <div className="form-group col-md-3">
                            <label className="form-label" htmlFor="specialPopulation"> População especial </label>
                            <select id="specialPopulation" className="form-select" {...register("specialPopulation")}>
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
                        <div className="form-group col-md-3 d-none" ref={otherSpecialPopulationInputContainerRef}>
                            <label className="form-label" htmlFor="otherSpecialPopulation">
                                População Especial
                            </label>
                            <input className="form-control" id="otherSpecialPopulation" {...register("otherSpecialPopulation")}></input>
                        </div>
                    </div>

                    <div className="row form-section justify-content-evenly">
                        <div className="form-group col-md-3">
                            <label className="form-label" htmlFor="city">
                                Cidade
                            </label>
                            <select className="form-select" id="city" value={selectedCityId} onChange={event => setSelectedCityId(parseInt(event.target.value))}>
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
                        <div className="form-group col-md-3">
                            <label className="form-label" htmlFor="district">
                                Bairro
                            </label>
                            <select className="form-select" id="district" disabled {...districtRegister} ref={(e) => {
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
                        <div className="form-group col-md-3">
                            <label className="form-label" htmlFor="nationality">
                                Nacionalidade
                            </label>
                            <select className="form-select" id="nationality" {...register("nationality.id", { required: true })}>
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
                        <div className="form-group col-md-3">
                                <label className="form-label" htmlFor="birthplace">
                                    Naturalidade
                                </label>
                                <input className="form-control" id="birthplace" {...register("birthplace", {required: true})}/>
                        </div>
                    </div>
                    <div className="row form-section justify-content-center">
                        <div className="col-md-8 form-group d-flex justify-content-center align-items-center mt-5">
                            <input id="responsabilityValidation" className="form-check-input pregnant-checkbox" type="checkbox"/>
                            <label className="form-check-label" htmlFor="responsabilityValidation">Assumo responsabilidade pelo envio dos dados</label>
                        </div>
                    </div>
                    <div className="row form-section justify-content-center">
                        <div className="form-group col-md-3">
                            <button type="submit" className="btn btn-primary w-100">Enviar</button>
                        </div>
                    </div>
                </form>
                
            </div>
        </div>
        </>
    )
}