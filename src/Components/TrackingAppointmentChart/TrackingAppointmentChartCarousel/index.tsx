import { DoubleMovingArrows } from "Components/Utils/DoubleMovingArrows"
import { TrackingAppointmentChartPopup } from "../TrackingAppointmentChartPopup"
import { useEffect, useState } from "react"

export type TrackingAppointmentChartCarrouselProps = {
    chartIds: number[];
    defaultSelectedId: number | undefined;
    onClose: () => void;
}

export const TrackingAppointmentChartCarrousel = ({ chartIds, defaultSelectedId, onClose} : TrackingAppointmentChartCarrouselProps) => {
    const [ selectedChartIndex, setSelectedChartIndex ] = useState<number>(-1)
    const [ selectedChartId, setSelectedChartId ] = useState<number>();

    const [ showArrowLeft, setShowArrowLeft ] = useState<boolean>(true);
    const [ showArrowRight, setShowArrowRight ] = useState<boolean>(true);

    const onClickArrowLeft = () => setSelectedChartIndex(current => current - 1);
    const onClickArrowRight = () => setSelectedChartIndex(current => current + 1);

    useEffect(() => {
        if (!!defaultSelectedId) {
            const index = chartIds.indexOf(defaultSelectedId);
            if (index >= 0) {
                setSelectedChartIndex(index);
            }
        }
        else {
            setSelectedChartId(undefined);
        }
    }, [defaultSelectedId]);

    useEffect(() => {
        if (selectedChartIndex === 0) {
            setShowArrowLeft(false);
        }
        if (selectedChartIndex === chartIds.length - 1) {
            setShowArrowRight(false);   
        } 

        if (selectedChartIndex > 0) {
            setShowArrowLeft(true);
        }
        if (selectedChartIndex < chartIds.length - 1) {
            setShowArrowRight(true);
        }
        
        if (selectedChartIndex >= 0 && selectedChartIndex <= chartIds.length - 1) 
        {
            setSelectedChartId(chartIds[selectedChartIndex]);
        }
    }, [selectedChartIndex]);

    useEffect(() => {
        if (!selectedChartId) {
            setSelectedChartIndex(-1)
        }
    }, [selectedChartId]);

   return (
    <>
    {
        !!selectedChartId &&
        chartIds.map(chartId => (
            <TrackingAppointmentChartPopup onClose={onClose} show={chartId === selectedChartId} chartId={chartId}/>
        ))
    }
    {
        !!selectedChartId && 
        <DoubleMovingArrows showLeft={showArrowLeft} showRight={showArrowRight} onClickLeft={onClickArrowLeft} onClickRight={onClickArrowRight}/>
    }
        
    </>
   )
}