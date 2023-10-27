import { Col, Form, Row } from "react-bootstrap"

export const ResponsabilityCheckbox = () => {
    return (
        <Row className='d-flex justify-content-center text-nowrap' style={{marginTop: '40px'}}>
            <Form.Group as={Col} md='6'>
                <Form.Check
                    label='Assumo responsabilidade pela submissão dos dados deste formulário *'
                />
            </Form.Group>
        </Row>
    )
}