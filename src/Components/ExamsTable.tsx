import { ComplementaryExamAPI } from "Api/Base/ComplementaryExamAPI"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { ComplementaryExam } from "types/Api/Exams/ComplementaryExam"
import { SaveLoadingAlert } from "./Utils/Alert/SaveLoadingAlert"
import { SaveSuccessAlert } from "./Utils/Alert/SaveSuccessAlert"
import { Patient } from "types/Api/Patient"
import { Button, Col, Container, Modal, Row, Table } from "react-bootstrap"
import { DeletePrompt } from "./Utils/DeletePrompt"
import { DeleteLoadingAlert } from "./Utils/Alert/DeleteLoadingAlert"
import { DeleteSuccessAlert } from "./Utils/Alert/DeleteSuccessAlert"

type ExamsTableProps<TExam extends ComplementaryExam> = {
    api: ComplementaryExamAPI<TExam>,
    tableHeaders: ReactNode,
    renderRowFields: (data: TExam) => ReactNode,
    renderPopup: (show: boolean, onClose: () => void, onSubmit: (data: TExam) => void, patient: Patient, data?: TExam) => ReactNode,
    patient: Patient | undefined,
}

export const ExamsTable = <TExam extends ComplementaryExam,>( { api, tableHeaders, renderRowFields, renderPopup, patient } : ExamsTableProps<TExam>) => {
    
    const { data: exams, isLoading, isError, refetch } = api.useAllByPatient(patient?.id);
    
    const { mutate: create, isLoading: isCreationLoading, isSuccess: isCreationSuccess } = api.useCreate();

    const { mutate: update, isLoading: isUpdateLoading, isSuccess: isUpdateSuccess } = api.useUpdate();

    const { mutate: remove, isLoading: isRemoveLoading, isSuccess: isRemoveSuccess } = api.useDelete();
    
    const [ showCreatePopup, setShowCreatePopup ] = useState<boolean>(false);

    const [ showSuccessMessage, setShowSuccessMessage ] = useState<boolean>(false);

    const [ idToRemove, setIdToRemove ] = useState<number | null>(null);

    const [ resourceToUpdate, setResourceToUpdate ] = useState<TExam | undefined>();

    const handleUpdate = useCallback((data: TExam) => { 
        if (resourceToUpdate) {
            update({ id: resourceToUpdate.id, resource: data });
            setResourceToUpdate(undefined); 
        }
    }, [resourceToUpdate, update]);

    const handleRemove = useCallback(() => {
        if (idToRemove) {
            remove({id: idToRemove}, {
                onSuccess: refetch
            });
            setIdToRemove(null);
        }
    }, [idToRemove, remove]);

    useEffect(() => {
        setShowSuccessMessage(isCreationSuccess || isUpdateSuccess);
        refetch();
    }, [isCreationSuccess, isUpdateSuccess]);

    return (
        <>

            <Row>
                <Col>
                    <Table bordered striped hover>
                        <thead>
                            <tr>
                                {tableHeaders}
                                <th>
                                    Arquivos
                                </th>
                                <th>
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                exams?.map(exam => 
                                    <tr>
                                        {renderRowFields(exam)}
                                        <td>
                                            <DownloadButton onClick={() => {}}/>
                                        </td>
                                        <td className='d-flex'>
                                            <Row>
                                                <Col>
                                                    <Button variant='danger' size='sm' style={{padding: '2px 6px'}} id='deleteBtn' onClick={() => setIdToRemove(exam.id)}>
                                                        <i className="bi bi-file-earmark-x" style={{color: 'white', fontSize: 20}}></i>
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button variant='primary' size='sm' style={{padding: '2px 6px'}} id='editBtn' onClick={() => setResourceToUpdate(exam)}>
                                                        <i className="bi bi-pencil" style={{color: 'white', fontSize: 20}}></i>
                                                    </Button>
                                
                                                </Col>
                                            </Row>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col md='2'>
                    <Button variant='success' onClick={() => setShowCreatePopup(true)}>Novo</Button>
                </Col>
            </Row>
            {
                patient &&
                renderPopup(showCreatePopup, () => setShowCreatePopup(false), (data: TExam) => { setShowCreatePopup(false); create(data); }, patient)
            }
            {
                patient &&
                renderPopup(!!resourceToUpdate, () => setResourceToUpdate(undefined), handleUpdate, patient, resourceToUpdate)
            }
            <SaveLoadingAlert show={isCreationLoading || isUpdateLoading}/>
            <SaveSuccessAlert show={showSuccessMessage} onClose={() => setShowSuccessMessage(false)}/>
            
            <DeletePrompt show={!!idToRemove} onConfirm={handleRemove} onCancel={() => setIdToRemove(null)}/>
            <DeleteLoadingAlert show={isRemoveLoading}/>
            <DeleteSuccessAlert showTrigger={isRemoveSuccess} />
        </>
    )

}

type DownloadButtonProps = {
    onClick: () => void
}


const DownloadButton = ({ onClick } : DownloadButtonProps) => {
    return (
        <Button variant='primary' size='sm' onClick={onClick} style={{padding: '2px 6px'}}>
            <i className="bi bi-download" style={{color: 'white', fontSize: 20}}></i>
        </Button>
    );
}

