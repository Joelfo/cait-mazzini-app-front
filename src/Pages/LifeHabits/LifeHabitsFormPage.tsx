import { ContraceptiveMethodAPI, useContraceptiveMethodApi } from "Api/useContraceptiveMethodApi";
import { LifeHabitsInfoAPI, useLifeHabitsInfoApi } from "Api/useLifeHabitsInfoApi";
import { PhysicalActivityAPI, usePhysicalActivityApi } from "Api/usePhysicalActivityApi";
import { PhysicalActivityForm } from "Components/Forms/PhysicalActivityForm";
import { LifeHabitsForm } from "Components/LifeHabitsForm";
import { MazziniPopup } from "Components/MazziniPopup/MazziniPopup";
import { ConnectionErrorAlert } from "Components/Utils/Alert/ConnectionErrorAlert";
import { useSelectedPatient } from "Hooks/useSelectedPatient"
import { useMemo, useState } from "react";
import { PhysicalActivity } from "types/Api/PhysicalActivity";

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

    const { data: physicalActivities, isLoading: isPhysicalActivitiesLoading, isError: isPhysicalActivitiesError } = physicalActivityAPI.useAll();

    const { data: contraceptiveMethods, isLoading: isContraceptiveMethodsLoading, isError: isContraceptiveMethodsError } = contraceptiveMethodAPI.useAll();

    const { mutate: saveLifeHabitsInfo, isLoading, isSuccess } = lifeHabitsInfoAPI.useCreate(); 

    const { mutate: savePhysicalActivity, isLoading: isPhysicalActitivitySaveLoading } = physicalActivityAPI.useCreate()

    // useMemo
    const isConnectionError = useMemo(() => (isPatientError || isContraceptiveMethodsError || isPhysicalActivitiesError), [isPatientError, isContraceptiveMethodsError, isPhysicalActivitiesError])


    // callbacks
    const handleSavePhysicalActivity = (data: PhysicalActivity) => {
        savePhysicalActivity(data, {
            onSettled: () => setShowPhysicalActivityPopup(false)
        });
    }


    return (
        <>
        {
            patient
            &&
            <> 
                <LifeHabitsForm physicalActivities={physicalActivities ?? []} contraceptiveMethods={contraceptiveMethods ?? []} patient={patient} onSubmit={saveLifeHabitsInfo} onClickNewPhysicalActivity={() => setShowPhysicalActivityPopup(true)}/>
                <MazziniPopup show={showPhysicalActivityPopup} title="Atividades físicas" onClose={() => setShowPhysicalActivityPopup(false)}>
                    <PhysicalActivityForm onSubmit={handleSavePhysicalActivity} />
                </MazziniPopup>
            </>
        }
            <ConnectionErrorAlert show={isConnectionError}/>
        </>

    )
}

function setShowPhysicalActivityPopup(arg0: boolean) {
    throw new Error("Function not implemented.");
}
