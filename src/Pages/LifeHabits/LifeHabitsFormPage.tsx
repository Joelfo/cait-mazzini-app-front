import { useContraceptiveMethodApi } from "Api/useContraceptiveMethodApi";
import { useLifeHabitsInfoApi } from "Api/useLifeHabitsInfoApi";
import { usePhysicalActivityApi } from "Api/usePhysicalActivityApi";
import { LifeHabitsForm } from "Components/LifeHabitsForm/LifeHabitsForm";
import { ConnectionErrorAlert } from "Components/Utils/Alert/ConnectionErrorAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient"
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LifeHabitsFormPage = () => {
    // useEffect
    //fmnsjndsn
    const [ showPhysicalActivityPopup, setShowPhysicalActivityPopup ] = useState(false);
    const [ showContraceptiveMethodPopup, setShowContraceptiveMethodPopup ] = useState(false);

    // classes
    const lifeHabitsInfoAPI = useLifeHabitsInfoApi();
    const physicalActivityAPI = usePhysicalActivityApi();
    const contraceptiveMethodAPI = useContraceptiveMethodApi();
    
    // custom Hooks
    const { patient, isError: isPatientError } = useSelectedPatient();

    const { data: physicalActivities, isLoading: isPhysicalActivitiesLoading, isError: isPhysicalActivitiesError, refetch: refetchPhysicalActivities } = physicalActivityAPI.useAll();

    const { data: contraceptiveMethods, isLoading: isContraceptiveMethodsLoading, isError: isContraceptiveMethodsError, refetch: refetchContraceptiveMethods } = contraceptiveMethodAPI.useAll();

    const { mutate: saveLifeHabitsInfo, isLoading, isSuccess } = lifeHabitsInfoAPI.useCreate(); 

    const navigate = useNavigate();
    // useMemo
    const isConnectionError = useMemo(() => (isPatientError || isContraceptiveMethodsError || isPhysicalActivitiesError), [isPatientError, isContraceptiveMethodsError, isPhysicalActivitiesError])

    useEffect(() => {
        if (isSuccess) {
            navigate(`/patient?patientId=${patient!.id}&savedData=true`);
        }

    }, [isSuccess]);
    return (
        <>
        {
            patient
            &&
            <> 
                <LifeHabitsForm 
                    isSubmitLoading={isLoading}
                    physicalActivities={physicalActivities ?? []}  
                    isContraceptiveMethodsLoading={isContraceptiveMethodsLoading} 
                    isPhysicalActivitiesLoading={isPhysicalActivitiesLoading} 
                    contraceptiveMethods={contraceptiveMethods ?? []} 
                    patient={patient} onSubmit={saveLifeHabitsInfo} 
                    onClickNewPhysicalActivity={() => setShowPhysicalActivityPopup(true)} 
                    onClickNewContraceptiveMethod={() => setShowContraceptiveMethodPopup(true)}
                />
             </>
        }
            <ConnectionErrorAlert show={isConnectionError}/>
        </>

    )
}

function setShowPhysicalActivityPopup(arg0: boolean) {
    throw new Error("Function not implemented.");
}
