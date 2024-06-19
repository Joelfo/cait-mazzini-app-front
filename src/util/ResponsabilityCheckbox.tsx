import { useUserContext } from "Contexts/useUserContext"
import { Col, Form, Row } from "react-bootstrap"
import { Controller, useFormContext } from "react-hook-form"
import { justRequiredRule } from "./validation"

export type ResponsabilityCheckboxProps = {
    fieldName: string
}

export const ResponsabilityCheckbox = ({ fieldName } : ResponsabilityCheckboxProps) => {
    const user = useUserContext();
    const { setValue, formState: { errors }, control } = useFormContext();
    return (
        <Row className='d-flex justify-content-center text-nowrap' style={{marginTop: '40px'}}>
            <Form.Group as={Col} md='6'>
                <Controller
                    name={fieldName}
                    rules={justRequiredRule('')}
                    control={control}
                    render={
                        ({
                            fieldState: { invalid }
                        }) => (
                            <Form.Check
                                isInvalid={invalid}
                                onChange={(event) => setValue(fieldName, user.id)}
                                label='Assumo responsabilidade pela submissão dos dados deste formulário *'
                            />
                        )
                    }
                />
            </Form.Group>
        </Row>
    )
}