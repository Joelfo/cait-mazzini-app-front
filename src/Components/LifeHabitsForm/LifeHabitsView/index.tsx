import { LifeHabitsInfoAPI, useLifeHabitsInfoApi } from 'Api/useLifeHabitsInfoApi';
import { useMemo } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { LifeHabitsInfo } from 'types/Api/LifeHabitsInfo';
import { ESexualActivityLevel } from 'types/enums/ESexualActivityLevel';
import { MazziniFormSection } from 'util/components/MazziniFormSection';

export const LifeHabitsView = ({ data } : LifeHabitsViewProps) => {

    const lifeHabitsInfoAPI = useLifeHabitsInfoApi();

    const { data: physicalActivities, error: physicalActivitiesError } = lifeHabitsInfoAPI.usePhysicalActivities(data.id);

    const physicalActivitiesText = useMemo(() => {
        return physicalActivities?.reduce<string>((text, physicalActivity, index) => {
            if (index === 0) {
                return physicalActivity.name;
            } else {
                return text + ', ' + physicalActivity.name;
            }
        }, '');
    }, [physicalActivities])
    
    return (
        <Container>
                <MazziniFormSection title='Alimentação e Hidratação'>
                    <Row>
                        <Form.Group as={Col} md='2'>
                            <Form.Label>Refeições por dia</Form.Label>
                            <Form.Control disabled value={data.mealsPerDay}/>
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Label className='text-nowrap'>Copos de água/Líquido por dia</Form.Label>
                            <Form.Control disabled value={data.waterCupsPerDay}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='2'>
                            <Form.Label> Observações </Form.Label>
                            <Form.Control disabled value={data.mealsPerDay}/>
                        </Form.Group>
                    </Row>
                </MazziniFormSection>
                <MazziniFormSection title='Eliminações'>
                    <Row>
                        <Col>
                            <b>Vesicais</b>
                        </Col>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='4'>
                            <Form.Label>Característica</Form.Label>
                            <Form.Control disabled value={data.bladderEliminationsCharacteristic}/>
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Label>Vezes ao dia</Form.Label>
                            <Form.Control disabled value={data.bladderEliminationTimesPerDay}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='4'>
                            <Form.Check
                                checked={data.hasPainOnBladderEliminations}
                                disabled={!data.hasPainOnBladderEliminations}
                                label='Dor'
                            />
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Col>
                            <b>Intestinais</b>
                        </Col>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='4'>
                            <Form.Label>Característica</Form.Label>
                            <Form.Control disabled value={data.intestinalEliminationsCharacteristic}/>
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Label>Vezes ao dia</Form.Label>
                            <Form.Control disabled value={data.intestinalEliminationTimesPerDay}/>
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='4'>
                            <Form.Check
                                checked={data.hasPainOnIntestinalEliminations}
                                disabled={!data.hasPainOnIntestinalEliminations}
                                label='Dor'
                            />
                        </Form.Group>
                    </Row>
                </MazziniFormSection>
                <MazziniFormSection title='Uso de'>
                    <Row>
                        <Form.Group as={Col} md='2'>
                            <Form.Check
                                label='Alcool'
                                disabled={!data.isAlcoholUser} 
                                checked={data.isAlcoholUser}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Label>
                                Quantidade
                            </Form.Label>
                            <Form.Control
                                value={data.alcoholQuantityObs}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Check
                                label='Cigarro'
                                checked={data.isSmoker}
                                disabled={!data.isSmoker}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Label>
                                Quantidade
                            </Form.Label>   
                            <Form.Control
                                value={data.cigarretesPerDay}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='2'>
                            <Form.Check
                                label='Ex-tabagista'
                                checked={data.isFormerSmoker}
                                disabled={!data.isFormerSmoker}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Label>
                                Quanto tempo parou
                            </Form.Label>
                            <Form.Control
                                value={data.timeWithoutSmoking}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Check
                                disabled={!data.isIllicitDrugsUser}
                                checked={data.isIllicitDrugsUser}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Label>
                                Qual(is)
                            </Form.Label>
                            <Form.Control
                                value={data.illicitDrugsUsingObs}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                </MazziniFormSection>
                <MazziniFormSection title='Sono e repouso'>
                    <Row>
                        <Form.Group as={Col} md='2'>
                            <Form.Check
                                label='Satisfatório'
                                disabled={!data.hasSatisfactorySleepingTime}
                                checked={data.hasSatisfactorySleepingTime}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Label>
                                Horas por noite
                            </Form.Label>
                            <Form.Control
                                value={data.sleepingHoursPerNight}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Label>
                                Observação
                            </Form.Label>
                            <Form.Control
                                value={data.sleepingTimeObs}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                </MazziniFormSection>
                <MazziniFormSection title='Atividade física'>
                    <Row>

                    <Form.Group as={Col} md='4'>
                        <Form.Label>Qual(is) pratica?</Form.Label>   
                        <Form.Control 
                            disabled
                            value={physicalActivitiesText}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md='2'>
                        <Form.Label>Vezes por semana</Form.Label>
                        <Form.Control
                            value={data.physicalActivityTimesPerWeek}
                            disabled
                        />
                    </Form.Group>
                    </Row>
                    <Row class='form-mazzini-row'>
                        <Form.Group as={Col} md='3'>
                            <Form.Label>Observações</Form.Label>
                            <Form.Control
                                value={data.physicalActivitiesObservation}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                </MazziniFormSection>
                <MazziniFormSection title='Lazer'>
                    <Form.Control
                        disabled
                        value={data.leisureObservation}
                    />
                </MazziniFormSection>
                <MazziniFormSection title='Atividade Sexual'>
                    <Row>
                    <Form.Group as={Col} md='2'>
                        {
                            data.sexualActivityLevel === ESexualActivityLevel.Active ?
                                <Form.Check
                                    type='radio'
                                    checked
                                    label='Ativa'
                                />
                                :
                                data.sexualActivityLevel === ESexualActivityLevel.Eventual ?
                                    <Form.Check
                                    type='radio'
                                    checked
                                    label='Eventual'
                                    />
                                    :
                                    <Form.Check
                                    type='radio'
                                    checked
                                    label='Inexistente'
                                    />
                        }
                    </Form.Group>
                    <Form.Group as={Col} md='2'>
                        <Form.Label>Quantos parceiros(as)</Form.Label>
                        <Form.Control
                            disabled
                            value={data.sexualPartnersQuantity}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md='2'>
                        <Form.Check
                            label='Método contraceptivo'
                        />
                        <Form.Group> { /*TODO: Adicionar quais */}</Form.Group>
                    </Form.Group>
                    <Form.Group as={Col} md='3'>
                        <Form.Check
                            checked={data.isPreservativeUser}
                            disabled={!data.isPreservativeUser}
                            label='Uso de preservativo'
                        />
                    </Form.Group>
                    </Row>
                    <Row className='form-mazzini-row'>
                        <Form.Group as={Col} md='2'>
                        <Form.Check
                            checked={data.hasPEP}
                            label='Uso de PEP'
                            disabled={!data.hasPEP}
                        />
                        </Form.Group>
                        <Form.Group as={Col} md='2'>
                            <Form.Check
                                label='Uso de PrEP'
                                disabled={!data.hasPrEP}
                                checked={data.hasPrEP}
                            />
                        </Form.Group>
                    </Row>
                </MazziniFormSection>
        </Container>
    )
}

export type LifeHabitsViewProps = {
    data: LifeHabitsInfo
}