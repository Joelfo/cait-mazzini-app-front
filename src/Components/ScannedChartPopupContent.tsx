import { Modal, Spinner, Stack } from "react-bootstrap";
import { MazziniPopup } from "./MazziniPopup/MazziniPopup";
import { IconButton2 } from "./IconButton/IconButton2";
import IconButton from "./IconButton";
import { useScannedChartAPI } from "Api/ScannedChartAPI";
import { useCallback, useEffect, useRef } from "react";

export type ScannedChartPopupProps = {
    patientId: number,
}

export const ScannedChartPopupContent = ({ patientId } : ScannedChartPopupProps) => {
    const { useShow, useCreate } = useScannedChartAPI();

    const { data: scannedChartFile, isLoading: isScannedChartFileLoading, error: errorOnLoading } = useShow(patientId);

    const { mutate: createScannedChart } = useCreate();

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileInputChange : React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!!event.target.files) {
            createScannedChart({patientId, file: event.target.files[0]});
        }
    }

    const handleAddClick = () => {
        fileInputRef.current?.click()
    };

    const handleDownloadClick = useCallback(() => {
        if (!!scannedChartFile) {
            const url = window.URL.createObjectURL(scannedChartFile);
            const fileLink = document.createElement('a');
            fileLink.href = url;
            fileLink.download = "ficha-escaneada";
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove();
        }
    }, [scannedChartFile]);

    return (
        <>
            <Stack direction="horizontal" className='align-items-start' gap={5}>
                {
                    (isScannedChartFileLoading && !errorOnLoading) &&
                    <Spinner/>
                }
                {
                    !!scannedChartFile &&
                    <IconButton2 iconClass="bi-download" text="Baixar ficha" onClick={handleDownloadClick}/> 
                }
                {
                    !!errorOnLoading &&
                    <>
                        <IconButton2 iconClass="bi-clipboard-plus" text="Adicionar ficha escaneada" onClick={handleAddClick}/>
                        <input style={{visibility: 'hidden'}} type='file' ref={fileInputRef} onChange={handleFileInputChange}/>
                    </>
                }
                <IconButton2 iconClass="bi-clipboard-minus" text="Remover ficha"/>
            </Stack>
        </>

    );
}