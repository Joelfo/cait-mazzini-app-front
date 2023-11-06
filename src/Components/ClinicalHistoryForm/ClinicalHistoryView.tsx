import { ClinicalHistoryAPi } from "Api/ClinicalHistoryAPI";
import { formToJSON } from "axios";
import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import { ClinicalHistory } from "types/Api/DTOs/ClinicalHistory";
import { MazziniFormSection } from "util/components/MazziniFormSection";

export const ClinicalHistoryView = ({ data } : ClinicalHistoryViewProps) => {

    const clinicalHistoryAPI = new ClinicalHistoryAPi();

    const { data: immunizations } = clinicalHistoryAPI.useImmunizations(data.id);
    const { data: clinicalHistoriesHasDatedImmunizations } = clinicalHistoryAPI.useDatedImmunizations(data.id);
    const { data: previousDeseases } = clinicalHistoryAPI.usePreviousDeseases(data.id);

    return (
        <Container fluid>
            <MazziniFormSection title='Doenças prévias'>
                <Row>
                {
                    previousDeseases?.map(previousDesease => (
                        <Form.Group as={Col} md='2'>
                            <Form.Check
                                label={previousDesease.name}
                                checked
                            />
                        </Form.Group>
                    ))
                }
                </Row>
                {
                    data.otherPreviousDeseases !== '' 
                    &&
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='3'>
                            <Form.Label>
                                Outros
                            </Form.Label>
                            <Form.Control
                                value={data.otherPreviousDeseases}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                }
            </MazziniFormSection>
            <MazziniFormSection title='Alergia'>
                <Row>
                    <Form.Group as={Col} md='2'>
                        <Form.Check
                            label='Alérgico(a)'
                            disabled={!data.isAlergic}
                            checked={data.isAlergic}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md='4'>
                        <Form.Label>Caso alérgico(a), especificar:</Form.Label>
                        <Form.Control
                            value={data.alergyObs}
                            disabled
                        />
                    </Form.Group>
                </Row>
            </MazziniFormSection>
            <MazziniFormSection title='Hospitalizações anteriores'>
                <Row><b>Internações anteriores</b></Row>
                <Row className='form-mazzini-row'>
                    <Form.Group as={Col} md='4'>
                        <Form.Check 
                            label='Possui internação(ões) anterior(es)'
                            checked={data.hasPreviousHospitalizations}
                            disabled={!data.previousHospitalizationsObs}
                        />
                    </Form.Group>
                    {
                        data.hasPreviousHospitalizations
                        &&
                        <Row className="form-mazzini-row">
                            <Form.Group as={Col} md='5'>
                                <Form.Label>
                                    Caso possua, especificar motivo(s):
                                </Form.Label>
                                <Form.Control
                                    disabled
                                    value={data.previousHospitalizationsObs}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='2'>
                                <Form.Label>Quanto tempo faz</Form.Label>
                                <Form.Control
                                    value={data.timeFromLastHospitalization}
                                    disabled
                                />
                            </Form.Group>
                        </Row>
                    }
                </Row>
                <Row className='form-mazzini-row'>
                    <b>Cirurgias anteriores</b>
                </Row>
                <Row className="form-mazzini-row">
                    <Form.Group as={Col} md='4'>
                        <Form.Check
                            disabled={!data.hasPreviousSurgery}
                            checked={data.hasPreviousSurgery}
                            label='Possui cirugia(s) anterior(es)'
                        />
                    </Form.Group>
                </Row>
                <Row className='form-mazzini-row'>
                    <Form.Group as={Col} md='5'>
                        <Form.Label>Caso possua, especificar motivo(s)</Form.Label>
                        <Form.Control
                            value={data.previousSurgeryObs}
                            disabled
                        />
                    </Form.Group>
                </Row>
            </MazziniFormSection>
            <MazziniFormSection title='Imunização'>
                <Row>
                    {
                        immunizations?.map(immunization => (
                            <Form.Group as={Col} md='2'>
                                <Form.Check
                                    checked
                                    label={immunization.name}
                                />
                            </Form.Group>
                        ))
                    }
                </Row>
                <Row className='form-mazzini-row'>
                    {
                        clinicalHistoriesHasDatedImmunizations?.map(clinicalHistoryHasDatedImmunization => (
                            <Col md='3'>
                                <Form.Group as={Stack}>
                                    <Form.Check
                                        checked
                                        label={clinicalHistoryHasDatedImmunization.datedImmunization.name}
                                    />
                                </Form.Group>
                                <Form.Group as={Stack} style={{marginTop: 10}}>
                                    <Form.Label>
                                        Última dose em
                                    </Form.Label>
                                    <Form.Control
                                        value={clinicalHistoryHasDatedImmunization.lastDoseDate}
                                        disabled
                                        type='date'
                                    />
                                </Form.Group>
                            </Col>
                        ))
                    }
                </Row>
                <Row className='form-mazzini-row'>
                    <Form.Group as={Col} md='3'>
                        <Form.Label>Outros</Form.Label>
                        <Form.Control
                            value={data.otherImmunizations}
                            disabled
                        />
                    </Form.Group>
                </Row>
            </MazziniFormSection>
        </Container>
    )
};

export type ClinicalHistoryViewProps = {
    data: ClinicalHistory
}