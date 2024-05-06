import { useMemo } from "react"
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { User } from "Api/Types/User"
import { EUserRole } from "Api/Types/enums/EUserRole"

export type UserViewProps = {
    data: User,
    onClickEditButton: (user: User) => void 
}

export const UserView = ({ data, onClickEditButton } : UserViewProps) => {

    const roleLabel = useMemo(() => {
        switch (data.role) {
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
    }, [data.role])

    return (
        <>
            <Stack gap={4} style={{width: '100%'}}>
                <Row>
                    <Form.Group as={Col} md='6'>
                        <Form.Label> CPF </Form.Label>
                        <Form.Control disabled value={data.cpf}/>
                    </Form.Group>
                    <Form.Group as={Col} md='6'>
                        <Form.Label> Nome </Form.Label>
                        <Form.Control disabled value={data.name}/>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md='6'>
                        <Form.Label> Email </Form.Label>
                        <Form.Control disabled value={data.email}/>
                    </Form.Group>
                    <Form.Group as={Col} md='6'>
                        <Form.Label> Cargo </Form.Label>
                        <Form.Control disabled value={roleLabel}/>
                    </Form.Group>
                </Row>
            </Stack>
            <Stack>
            </Stack>
        </>
    )
} 