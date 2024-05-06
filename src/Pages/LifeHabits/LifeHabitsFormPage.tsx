import { ContraceptiveMethodAPI, useContraceptiveMethodApi } from "Api/useContraceptiveMethodApi";
import { LifeHabitsInfoAPI, useLifeHabitsInfoApi } from "Api/useLifeHabitsInfoApi";
import { PhysicalActivityAPI, usePhysicalActivityApi } from "Api/usePhysicalActivityApi";
import { ContraceptiveMethodForm } from "Components/Forms/ContraceptiveMethodForm";
import { PhysicalActivityForm } from "Components/Forms/PhysicalActivityForm";
import { LifeHabitsForm } from "Components/LifeHabitsForm/LifeHabitsForm";
import { MazziniPopup } from "Components/MazziniPopup/MazziniPopup";
import { ConnectionErrorAlert } from "Components/Utils/Alert/ConnectionErrorAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient"
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContraceptiveMethod } from "Api/Types/ContraceptiveMethod";
import { PhysicalActivity } from "Api/Types/PhysicalActivity";

export const LifeHabitsFormPage = () => {
    // useEffect
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
