import './styles.css';

import SearchBar from "Components/SearchBar";
import PersonIconButton from 'Components/IconButton/PersonIconButton';
import { useEffect, useState } from 'react';
import { LaravelPage } from 'types/vendor/LaravelPage/LaravelPage';
import { Patient } from 'types/Patient';
import { AxiosParams } from 'types/vendor/AxiosParams';
import { API_URL } from 'util/requests';
import axios from 'axios';
import AddButton from 'Components/IconButton/AddButton';
import { Link } from 'react-router-dom';

const ReceptionistHome = () => {

    const [page, setPage] = useState<LaravelPage<Patient>>();

    useEffect(() => {
        const param: AxiosParams = {
            method: 'GET',
            url: `${API_URL}/patients`,
            params: {
                page: 1,
                limit: 10
            }
        };
        axios(param)
            .then((response) => {
                setPage(response.data);
            })
            .catch((error) => {
                console.log(error)
            });
    }, [])
    return(
        <div className="receptionist-home-container container">
            <div className="top-container d-flex justify-content-evenly align-items-center">
            <Link to="/patientForm">
                <AddButton/>
            </Link>
            <SearchBar/>
            <PersonIconButton text="Usuário"/>
            </div>
            <div className="bottom-container row">
             
                {page && page.data.map((patient) => (
                    <div className="item-container col-2" key={patient.id.toString()}>
                        <a href={'/patient/' + patient.id}>
                            <PersonIconButton text={patient.name}/>
                        </a>
                    </div>
                    ) )}
            
                <div className="item-container col-2">
                    <AddButton/>
                </div>
            </div>
        </div>
    )
}

export default ReceptionistHome;