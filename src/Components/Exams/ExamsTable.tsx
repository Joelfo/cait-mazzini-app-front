import { ComplementaryExamAPI } from "Api/Base/ComplementaryExamAPI"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { ComplementaryExam } from "Api/Types/Exams/ComplementaryExam"
import { SaveLoadingAlert } from "../Utils/Alert/SaveLoadingAlert"
import { SaveSuccessAlert } from "../Utils/Alert/SaveSuccessAlert"
import { Patient } from "Api/Types/Patient"
import { Button, Col, Container, ListGroup, Modal, OverlayTrigger, Popover, Row, Table } from "react-bootstrap"
import { DeletePrompt } from "../Utils/DeletePrompt"
import { DeleteLoadingAlert } from "../Utils/Alert/DeleteLoadingAlert"
import { DeleteSuccessAlert } from "../Utils/Alert/DeleteSuccessAlert"
import { useComplementaryExamApi } from "Api/Base/useComplementaryExamApi"
import { SuccessDismissibleAlert } from "Components/Utils/Alert/SuccessDismissibleAlert"
import { useExamFileApi } from "Api/useExamFileApi"
import { ComplementaryExamDTO } from "Api/Types/DTOs/ComplementaryExamDTO"
import { ExamFile } from "Api/Types/Exams/ExamFile"

type ExamsTableProps<TExam extends ComplementaryExam> = {
    tableHeaders: ReactNode,
    renderRowFields: (data: TExam) => ReactNode,
    renderPopup: (show: boolean, onClose: () => void, onSubmit: (data: ComplementaryExamDTO<TExam>) => void, patient: Patient, data?: TExam) => ReactNode,
    patient: Patient | undefined,
    examType: string
}

export const ExamsTable = <TExam extends ComplementaryExam,>( { tableHeaders, renderRowFields, renderPopup, patient, examType } : ExamsTableProps<TExam>) => {
    
    const api = useComplementaryExamApi<TExam>(examType + 'Exams');
    const fileApi = useExamFileApi();

    const { data: exams, refetch } = api.useAllByPatient(patient?.id);
    const { mutate: create, isLoading: isCreationLoading, isSuccess: isCreationSuccess } = api.useCreate();
    const { mutate: update, isLoading: isUpdateLoading, isSuccess: isUpdateSuccess } = api.useUpdate();
    const { mutate: remove, isLoading: isRemoveLoading, isSuccess: isRemoveSuccess } = api.useRemove();

    const { mutate: uploadFile } = fileApi.useUpload();
    const { mutateAsync: getFile } = fileApi.useDownload();

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
            remove({id: idToRemove});
            setIdToRemove(null);
        }
    }, [idToRemove, remove]);

    const handleFileDownload = (file: Blob, fileName: string) => {
        const url = window.URL.createObjectURL(file);
        const fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download = fileName;
        document.body.appendChild(fileLink);
        fileLink.click();
        fileLink.remove();
    }

    useEffect(() => {
        if (isCreationSuccess || isUpdateSuccess) {
            refetch();
        }
    }, [isUpdateSuccess, isCreationSuccess]);

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
                                        {renderRowFields(exam as TExam)}
                                        <td>
                                            <OverlayTrigger  
                                            
                                                placement="bottom-start" 
                                                trigger='click'
                                                rootClose
                                                overlay={
                                                    <Popover>
                                                        <FilesPopoverBody 
                                                            files={(exam as TExam).examFiles} 
                                                            onClickAll={() => {}}
                                                            onClickFile={(id, fileName) => getFile({examId: (exam as TExam)?.id, fileId: id}, { onSuccess: (data) => handleFileDownload(data, fileName)})}
                                                        />
                                                    </Popover>
                                                }>
                                                <Button variant='primary' size='sm' style={{padding: '2px 6px'}}>
                                                    <i className="bi bi-download" style={{color: 'white', fontSize: 20}}></i>
                                                </Button>
                                            </OverlayTrigger>

                                        </td>
                                        <td className='d-flex'>
                                            <Row>
                                                <Col>
                                                    <Button variant='danger' size='sm' style={{padding: '2px 6px'}} id='deleteBtn' onClick={() => setIdToRemove((exam as TExam).id)}>
                                                        <i className="bi bi-file-earmark-x" style={{color: 'white', fontSize: 20}}></i>
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button variant='primary' size='sm' style={{padding: '2px 6px'}} id='editBtn' onClick={() => setResourceToUpdate(exam as TExam)}>
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
                renderPopup(showCreatePopup, () => setShowCreatePopup(false), (data: ComplementaryExamDTO<TExam>) => { setShowCreatePopup(false); create(data); }, patient)
            }
            {
                patient &&
                renderPopup(!!resourceToUpdate, () => setResourceToUpdate(undefined), handleUpdate, patient, resourceToUpdate)
            }

            <SaveLoadingAlert show={isCreationLoading || isUpdateLoading}/>
            <SuccessDismissibleAlert showTrigger={isCreationSuccess || isUpdateSuccess} text='Exame salvo com sucesso'/>
            
            <DeletePrompt show={!!idToRemove} onConfirm={handleRemove} onCancel={() => setIdToRemove(null)}/>
            <DeleteLoadingAlert show={isRemoveLoading}/>
            <DeleteSuccessAlert showTrigger={isRemoveSuccess} />
        </>
    )

}

type FilesPopoverProps = {
    files: ExamFile[],
    onClickFile: (id: number, name: string) => void,
    onClickAll: () => void
}

const FilesPopoverBody = ({files, onClickFile, onClickAll} : FilesPopoverProps) => {
    return (
        <Popover.Body>
            <ListGroup>
                {
                    files.map((file, index) => <ListGroup.Item action onClick={() => onClickFile(file.id, file.name)}>{file.name}</ListGroup.Item>)
                }
                {
                    files.length < 0 ?
                    <ListGroup.Item action onClick={onClickAll}>Todos</ListGroup.Item>
                    :
                    <ListGroup.Item>Sem arquivos para esse exame.</ListGroup.Item>
                }

            </ListGroup>
        </Popover.Body>
    )
}

