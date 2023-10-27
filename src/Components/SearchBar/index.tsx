
import "./styles.css";
import { PatientAPI } from "Api/PatientAPI";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { redirect, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const patientAPI = new PatientAPI();
  const [ nameToSearch, setNameToSearch ] = useState<string>();
  const { data: patients } = patientAPI.useAllByName(nameToSearch)
  
  const navigate = useNavigate();

  const searchPatient = (name: string) => {
    const selectedPatient = patients?.find(patient => patient.name === name);
    if (selectedPatient) {
      navigate('/patient?patientId=' + selectedPatient.id);
    } 
    else {

    }
    
  } 

  return (
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
          <button className="btn btn-primary" onClick={() => searchPatient(nameToSearch ?? '')}>
            <h6>Buscar</h6>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
