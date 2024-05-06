import { useUserApi } from "Api/useUserApi";
import { UserList } from "Components/User/UserList";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { User } from "Api/Types/User";
import { EUserRole } from "Api/Types/enums/EUserRole";

export const UserListPage = () => {
    const userApi = useUserApi();
    const { data: users } = userApi.useAll();
    
    const [ filteredUsers, setFilteredUsers ] = useState<User[]>([]);

    useEffect(() => {
        if (!!users) 
            setFilteredUsers(users)
    }, [users])

    const applyFilters = useCallback(({ role, name } : { role: EUserRole | undefined, name: string }) => {
        if (users) {
            let filteredResult = users;
            if (!!role)
                filteredResult = users.filter(user => user.role === role);
            if (name !== '')
                filteredResult = filteredResult.filter(user => user.name.toLowerCase().includes(name));

            setFilteredUsers(filteredResult);
        }
    }, [users]);

    const {
        handleSubmit,
        control,
        register
     } = useForm<{
        name: string,
        role: EUserRole | undefined
    }>();

    const onSubmitFilter = (filter : {name: string, role: EUserRole | undefined}) => {
        if (!!filter.role) {
            filter.role = parseInt(filter.role.toString()) as EUserRole;
        }
        applyFilters(filter);
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit(onSubmitFilter)}>
                <Row>
                    <Form.Group as={Col} md='3'>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control {...register('name')}/>
                    </Form.Group>
                    <Form.Group as={Col} md='2'>
                        <Form.Label>Cargo</Form.Label>
                        <Form.Select {...register('role')}>
                            <option value=''>Todos</option>
                            <option value={EUserRole.Nurse}>Enfermeiro(a)</option>
                            <option value={EUserRole.Physician}>Médico(a)</option>
                            <option value={EUserRole.Pharmaceutical}>Farmacêutico(a)</option>
                            <option value={EUserRole.Admin}>Administrador(a)</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md='2' style={{display: 'flex', alignItems: 'end'}}>
                        <Button type='submit'>
                            Filtrar
                        </Button>
                    </Form.Group>
                </Row>
            </Form>
            <hr></hr>
            <UserList users={filteredUsers}/>
        </Container>
    )
};