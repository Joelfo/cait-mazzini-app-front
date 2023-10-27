import './styles.css';

import SearchBar from "Components/SearchBar";
import PersonIconButton from 'Components/IconButton/PersonIconButton';
import { useEffect, useState } from 'react';
import { LaravelPage } from 'types/vendor/LaravelPage/LaravelPage';
import { Patient } from 'types/Api/Patient';
import { AxiosParams } from 'types/vendor/AxiosParams';
import { API_URL } from 'util/requests';
import axios from 'axios';
import AddButton from 'Components/IconButton/AddButton';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { usePatientsStore } from 'Stores/UsePatientsStore';
import { PatientAPI } from 'Api/PatientAPI';
import { Alert, Container } from 'react-bootstrap';

const ReceptionistHome = () => {
    const setSelectedPatientId = usePatientsStore(state => state.setSelectedPatientId);

    const patientAPI = new PatientAPI();

    const [patientPageSkip, setPatientPageSkip] = useState<number>(0);
    const patientPageTake = 10;

    const { data: patients } = patientAPI.useAllPaginated(patientPageSkip, patientPageTake);

    const [ isSavedDataAlertVisible, setIsSavedDataAlertVisible ] = useState<boolean>(false);
    const searchParams = useSearchParams()[0];

    useEffect(() => {
        const savedData = searchParams.get('savedData');
        if (savedData) {
            setIsSavedDataAlertVisible(Boolean(savedData));
        }
    }, []);

    return(
        <>
            <div className="receptionist-home-container container">
                <div className="top-container d-flex justify-content-evenly align-items-center">
                <Link to="/patientForm">
                    <AddButton/>
                </Link>
                <SearchBar/>
                <PersonIconButton text="Usuário"/>
                </div>
                <div className="bottom-container row">
                
                    {
                        patients?.map((patient) => (
                            <div className="item-container col-2" key={patient.id.toString()}>
                                <Link to={`/patient?patientId=${patient.id}`} onClick={() => setSelectedPatientId(patient.id)}>
                                    <PersonIconButton text={patient.name}/>
                                </Link>
                            </div>
                            ) )
                    }
                
                    <div className="item-container col-2">
                        <Link to="/patientForm">
                            <AddButton/>
                        </Link>
                    </div>
                </div>
            </div>
            <Container className='fixed-top'>
                <Alert
                    variant='success'
                    show={isSavedDataAlertVisible}
                    dismissible
                    onClose={() => setIsSavedDataAlertVisible(false)}
                >
                    <Alert.Heading>
                       Dados salvos com sucesso.
                    </Alert.Heading>
                </Alert>
            </Container>
        </>
        
    )
}

export default ReceptionistHome;