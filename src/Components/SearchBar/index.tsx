
import { TimedAlert } from "Components/Utils/Alert/TimedAlert";
import "./styles.css";
import { PatientAPI } from "Api/PatientAPI";
import { useMemo, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { redirect, useNavigate } from "react-router-dom";
import { usePatientApi } from "Api/usePatientApi";


export const PatientSearchBar = () => {

  const [showNotFoundAlert, setShowNotFoundAlert ] = useState<boolean>(false);

  const patientAPI = usePatientApi();
  const [ nameToSearch, setNameToSearch ] = useState<string>();
  const { data: patients, isLoading, isStale, isPaused } = patientAPI.useAllByName(nameToSearch)
  
  const navigate = useNavigate();


  const isPatientsLoading = useMemo(() => isLoading && !isPaused && !isStale, [isLoading, isPaused, isStale]);

  const searchPatient = (name: string) => {
    const selectedPatient = patients?.find(patient => patient.name === name);
    if (selectedPatient) {
      navigate('/patient?patientId=' + selectedPatient.id);
    } 
    else {
      setShowNotFoundAlert(true);
    }
  } 

  return (
    <>
        <div className="search-bar">
          <div className="row search-form">
            <div className="col-9">
              <Typeahead
                options={patients?.map(country => country.name) ?? new Array() as string[]}
                onInputChange={(value) => {
                  setNameToSearch(value);
                }}
                onChange={(selected) => {
                  const selectedName = selected[0] as string;
                  if (!selectedName) {
                    return;
                  }
                  searchPatient(selectedName);
                }}
                renderInput={({
                  inputRef,
                  referenceElementRef,
                  value,
                  ...inputProps
                }) => (
                  <div>
                    <Form.Control
                      {
                        ...inputProps
                      }
                      ref={(input: HTMLInputElement) => {
                      referenceElementRef(input);
                      inputRef(input);
                      }}
                      value={typeof value === 'object' ? [...value] : value}
                      type="text"
                      placeholder="Digite o nome ou código do paciente"
                      className="search-form-control"
                    />
                  </div>
                
                )}
              />
              
            </div>
            <div className="col-3">
              <button className="btn btn-primary" onClick={() => searchPatient(nameToSearch ?? '')} disabled={isPatientsLoading}>
                {
                  isPatientsLoading ?
                    <Spinner/>
                    :
                    <h6>Buscar</h6>
                }
              </button>
            </div>
          </div>
        </div>
        <TimedAlert onClose={() => setShowNotFoundAlert(false)} variant='danger' show={showNotFoundAlert}>
          Não foi encontrado um paciente com o nome ou código fornecido.
        </TimedAlert>
    </>

  );
};
