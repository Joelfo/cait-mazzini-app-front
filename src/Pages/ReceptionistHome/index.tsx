import './styles.css';

import { PatientSearchBar } from "Components/SearchBar";
import PersonIconButton from 'Components/IconButton/PersonIconButton';
import { useContext, useEffect, useState } from 'react';
import { LaravelPage } from 'types/vendor/LaravelPage/LaravelPage';
import { Patient } from 'Api/Types/Patient';
import { AxiosParams } from 'types/vendor/AxiosParams';
import { API_URL } from 'util/requests';
import axios from 'axios';
import AddButton from 'Components/IconButton/AddButton';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { usePatientsStore } from 'Stores/UsePatientsStore';
import { PatientAPI } from 'Api/PatientAPI';
import { Alert, Container, Modal, Spinner } from 'react-bootstrap';
import { TimedAlert } from 'Components/Utils/Alert/TimedAlert';
import { usePatientApi } from 'Api/usePatientApi';
import { useSelectedPatient } from 'Hooks/useSelectedPatient';
import { UserView } from 'Components/User/UserView';
import { UserContext } from 'Contexts/UserContext';
import { useUserApi } from 'Api/useUserApi';
import { MazziniPopup } from 'Components/MazziniPopup/MazziniPopup';

const ReceptionistHome = () => {
    const user = useContext(UserContext);

    const setSelectedPatientId = usePatientsStore(state => state.setSelectedPatientId);

    const patientAPI = usePatientApi();

    const [patientPageSkip, setPatientPageSkip] = useState<number>(0);
    const patientPageTake = 10;

    const { data: patients, isLoading: isPatientsLoading } = patientAPI.useAllPaginated(patientPageSkip, patientPageTake);

    const [ isSavedDataAlertVisible, setIsSavedDataAlertVisible ] = useState<boolean>(false);
    const searchParams = useSearchParams()[0];

    const [ showUserDetails, setShowUserDetails ] = useState(false);

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
                <PatientSearchBar/>
                <PersonIconButton text="Usuário" onClick={() => setShowUserDetails(true)}/>
                </div>
                <div className="bottom-container row">
                
                    {
                        
                            patients?.map((patient) => {
                                console.log(patient);
                               return (
                                <div className="item-container col-2" key={patient.id.toString()}>
                                    <Link to={`/patient?patientId=${patient.id}`} onClick={() => setSelectedPatientId(patient.id)}>
                                        <PersonIconButton text={patient.name}/>
                                    </Link>
                                </div>
                                )})
                                
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
            <MazziniPopup title='Detalhes do usuário' show={showUserDetails} onClose={() => setShowUserDetails(false)}>
                {
                    !!user
                    &&
                    <UserView data={user} onClickEditButton={() => {}}/>
                }
            </MazziniPopup>
        </>
        
    )
}

export default ReceptionistHome;