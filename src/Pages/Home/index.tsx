import './styles.css';

import { PatientSearchBar } from "Components/SearchBar";
import PersonIconButton from 'Components/IconButton/PersonIconButton';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LaravelPage } from 'types/vendor/LaravelPage/LaravelPage';
import { Patient } from 'Api/Types/Patient';
import { AxiosParams } from 'types/vendor/AxiosParams';
import { API_URL } from 'util/requests';
import axios from 'axios';
import AddButton from 'Components/IconButton/AddButton';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePatientsStore } from 'Stores/UsePatientsStore';
import { PatientAPI } from 'Api/PatientAPI';
import { Alert, Button, Col, Container, Form, ListGroup, Modal, ModalDialog, OverlayTrigger, PageItemProps, Popover, Row, Spinner, Stack } from 'react-bootstrap';
import { TimedAlert } from 'Components/Utils/Alert/TimedAlert';
import { usePatientApi } from 'Api/usePatientApi';
import { useSelectedPatient } from 'Hooks/useSelectedPatient';
import { UserView } from 'Components/User/UserView';
import { UserContext } from 'Contexts/UserContext';
import { useUserApi } from 'Api/useUserApi';
import { MazziniPopup } from 'Components/MazziniPopup/MazziniPopup';
import { usePatientsAppointmentLineApi } from 'Api/usePatientsAppointmentLineApi';
import { IconButton2 } from 'Components/IconButton/IconButton2';
import { Typeahead } from 'react-bootstrap-typeahead';
import { PatientBasicInfo } from 'Api/Types/BasicInfo/PatientBasicInfo';
import { XCircle } from 'react-bootstrap-icons';
import { EUserRole } from 'Api/Types/enums/EUserRole';

const Home = () => {
    const user = useContext(UserContext);

    const patientAPI = usePatientApi();

    const [isSavedDataAlertVisible, setIsSavedDataAlertVisible] = useState<boolean>(false);
    const searchParams = useSearchParams()[0];

    const [showUserDetails, setShowUserDetails] = useState(false);

    const patientsAppointmentLineApi = usePatientsAppointmentLineApi();

    const { data: patientsAppointmentLine, refetch: refetchPatientsAppointmentLine } = patientsAppointmentLineApi.useGetLine();

    const { mutate: addPatientsAppointmentLineEntry } = patientsAppointmentLineApi.useAddEntry();

    const patientsAppointmentLineLastPosition = useMemo(() => (patientsAppointmentLine ?? []).length - 1, [patientsAppointmentLine]);

    const [ patientNameToSearch, setPatientNameSearch ] = useState<string>();

    const { data: filteredPatients, isLoading, isStale, isPaused } = patientAPI.useAllByName(patientNameToSearch)

    const isPatientsLoading = useMemo(() => isLoading && !isPaused && !isStale, [isLoading, isPaused, isStale]);

    const [ showPatientAlreadyInLineError, setShowPatientAlreadyInLineError ] = useState(false);

    const [ showLineEntryInputOverlay, setShowLineEntryInputOverlay ] = useState(false);

    const [ patientToRemoveFromLine, setPatientToRemoveFromLine ] = useState<PatientBasicInfo | null>(null);

    const { mutate: removeEntryFromLine } = patientsAppointmentLineApi.useRemoveEntry();

    const handleRemoveEntryFromLine = useCallback(() => {
        if (!!patientToRemoveFromLine) {
            removeEntryFromLine(patientToRemoveFromLine.id, {
                onSuccess: () => { refetchPatientsAppointmentLine(); setPatientToRemoveFromLine(null) }
            });
        }
    } ,[patientToRemoveFromLine, refetchPatientsAppointmentLine, removeEntryFromLine])

    const handleAddPatientOnLine = useCallback((patient: PatientBasicInfo) => {
        setShowPatientAlreadyInLineError(false);
        if (!patient) {
            return;
        }

        if (!!patientsAppointmentLine?.find(x => x.patient.id === patient.id)) {
            setShowPatientAlreadyInLineError(true);
            return;
        }

        addPatientsAppointmentLineEntry({
            patientId: patient.id,
            order: patientsAppointmentLineLastPosition + 1
        }, {
            onSuccess: () => {
                refetchPatientsAppointmentLine();
                setShowLineEntryInputOverlay(false);
            }
        });
    }, [addPatientsAppointmentLineEntry, patientsAppointmentLine, patientsAppointmentLineLastPosition, refetchPatientsAppointmentLine]);

    const navigate = useNavigate();

    useEffect(() => {
        const savedData = searchParams.get('savedData');
        if (savedData) {
            setIsSavedDataAlertVisible(Boolean(savedData));
        }
    }, []);

    useEffect(() => {
        patientsAppointmentLine?.sort((a, b) => a.order - b.order);
    }, [patientsAppointmentLine]);

    return (
        <>
            <div className="receptionist-home-container container" style={{maxHeight: 'calc(100vh - 76px)'}}>
                <div className="top-container d-flex justify-content-evenly align-items-center">
                    <Link to="/patientForm">
                        <AddButton />
                    </Link>
                    <PatientSearchBar patients={filteredPatients ?? []} isLoading={isPatientsLoading} nameToSearch={patientNameToSearch} onChange={setPatientNameSearch}/>
                    <PersonIconButton text="Usuário" onClick={() => setShowUserDetails(true)} />
                </div>
                <Stack gap={2}>
                    <Stack direction='horizontal' gap={2}>
                        <h3>Pacientes em atendimento</h3> 
                        {
                            user?.role === EUserRole.Receptionist
                            &&
                            <Stack style={{maxWidth: '50px'}}>
                                <OverlayTrigger
                                    placement='bottom'
                                    trigger='click'
                                    rootClose
                                    overlay={
                                        <Stack className='bg-secondary' style={{border: '1px solid black', padding: '20px', borderRadius: '10px', marginTop: '5px'}}>
                                                <ListGroup>
                                                    {
                                                        !!patientsAppointmentLine && patientsAppointmentLine.length > 0 ?
                                                            patientsAppointmentLine.map(entry => (
                                                                <ListGroup.Item key={entry.patient.id} action onClick={() => setPatientToRemoveFromLine(entry.patient)}>
                                                                    {entry.patient.name}
                                                                </ListGroup.Item>
                                                            ))
                                                            :
                                                            <ListGroup.Item><p>Sem pacientes em atendimento.</p></ListGroup.Item>
                                                    }
                                                </ListGroup>
                                        </Stack>
                                    }
                                >
                                    <Button variant='danger'><XCircle color='white'/></Button>
                                </OverlayTrigger>
                            </Stack>
                        }
                        </Stack>
                            
                    
                    <Container className='bottom-container' style={{maxHeight: '100%'}}>
                        <Row className='gx-5'>
                            {
                                patientsAppointmentLine?.map(entry => (
                                    <Col md='2'>
                                        <PersonIconButton text={entry.patient.name} key={entry.patient.id} onClick={() => navigate('/patient?patientId=' + entry.patient.id)}></PersonIconButton>
                                    </Col>
                                ))
                            }
                            {
                                user?.role === EUserRole.Receptionist
                                &&
                                <Col md='2'>
                                    <OverlayTrigger 
                                        trigger='click'
                                        placement='bottom'
                                        rootClose
                                        show={showLineEntryInputOverlay}
                                        onToggle={(show) => setShowLineEntryInputOverlay(show)}
                                        overlay={
                                            <Popover>
                                                <Popover.Body>
                                                    <Typeahead
                                                        placeholder='Nome, código ou CPF'
                                                        options={filteredPatients ?? []}
                                                        labelKey={'name'}
                                                        onChange={(selected) => handleAddPatientOnLine(selected[0] as PatientBasicInfo)}
                                                        onInputChange={setPatientNameSearch}
                                                        renderInput={({
                                                            inputRef,
                                                            referenceElementRef,
                                                            value,
                                                            ...inputProps
                                                        }) => (
                                                            <div>
                                                                <Form.Group>
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
                                                                        isInvalid={showPatientAlreadyInLineError}
                                                                    />
                                                                    <Form.Control.Feedback type='invalid'>O paciente já se encontra em atendimento</Form.Control.Feedback>
                                                                </Form.Group>
                                                            </div>
                                                        
                                                        )}
                                                    />
                                                </Popover.Body>
                                            </Popover>
                                        }    
                                    >
                                
                                        <div>
                                            <IconButton2 iconClass='bi-plus-lg' text='Adicionar à fila'/>
                                        </div>
                                    </OverlayTrigger>
                                </Col>
                            }
                        </Row>
                    </Container>
                </Stack>
                
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
                    <UserView data={user} onClickEditButton={() => { }} />
                }
            </MazziniPopup>
            <Modal show={!!patientToRemoveFromLine}>
                <Modal.Body>
                    Deseja retirar o paciente {patientToRemoveFromLine?.name} dos pacientes em atendimento? 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger' onClick={() => setPatientToRemoveFromLine(null)}>Cancelar</Button>
                    <Button onClick={handleRemoveEntryFromLine}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default Home;