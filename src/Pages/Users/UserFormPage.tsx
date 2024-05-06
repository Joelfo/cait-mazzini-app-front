import { useUserApi } from "Api/useUserApi"
import { UserForm } from "Components/User/UserForm";
import { SaveLoadingAlert } from "Components/Utils/Alert/SaveLoadingAlert";
import { Container, Stack } from "react-bootstrap";

export const UserFormPage = () => {
    const userApi = useUserApi();

    const { mutate: saveUser, isLoading } = userApi.useCreate();

    return (
        <Container>
            <Stack gap={3}>
                <Stack style={{justifyContent: 'center'}}>
                    <h2>Novo usuário</h2>
                    <hr></hr>
                </Stack>
                <UserForm onSubmit={saveUser}/>
            </Stack>

            <SaveLoadingAlert show={isLoading}/>
        </Container>
    )
}