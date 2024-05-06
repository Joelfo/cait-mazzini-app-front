import { IconButton2 } from "Components/IconButton/IconButton2";
import { Stack, Table } from "react-bootstrap";
import { User } from "Api/Types/User";
import { EUserRole } from "Api/Types/enums/EUserRole";

export type UserListProps = {
    users: User[] 
};

export const UserList = ({ users } : UserListProps) => {
    const getRoleLabel = (role: EUserRole) => {
        switch (role) {
            case EUserRole.Receptionist:
                return "Recepcionista"
            case EUserRole.Nurse:
                return "Enfermeiro(a)"
            case EUserRole.Physician:
                return "Médico(a)"
            case EUserRole.Pharmaceutical:
                return "Farmacêutico(a)"
            case EUserRole.Admin:
                return "Administrador(a)"
        }
    }

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>
                            Nome
                        </th>
                        <th>
                            Cargo
                        </th>
                        <th>
                            Cpf
                        </th>
                        <th>
                            Email
                        </th>
                        <th>
                            Editar
                        </th>
                        <th>
                            Remover
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(user => (
                            <tr>
                                <td>
                                   { user.name } 
                                </td>
                                <td>
                                    { getRoleLabel(user.role) }
                                </td>
                                <td>
                                    { user.cpf }
                                </td>
                                <td>
                                    { user.email }
                                </td>
                                <td>
                                    <div style={{display: 'flex', justifyContent: 'start', width: '100%'}}>
                                        <IconButton2 iconSize="16px" width='30px' height="30px" iconClass="bi-pen-fill"/>
                                    </div>
                                    
                                </td>
                                <td>
                                    <div style={{display: 'flex', justifyContent: 'start'}}>
                                        <IconButton2 variant='danger' iconSize='16px' width="30px" height="30px" iconClass="bi-x-lg"/>
                                    </div>

                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </>
    )
}