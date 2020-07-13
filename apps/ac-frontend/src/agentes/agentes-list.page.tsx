import React from 'react';
import { Page } from '../components/page';
import { Loading } from '../components/loading';
import { EuiFlexGroup, EuiFlexItem, EuiButton, EuiCard, EuiFlexGrid } from '@elastic/eui';
import { Link, useHistory } from 'react-router-dom';
import { useFetchAgentes } from './agente-api';
import { AgenteDTO } from '@access-control/agentes';
import { environment } from '../environments/environment';

export function AgentesListPage() {
    const { status, data, isFetching } = useFetchAgentes();
    const loading = status === 'loading';
    const agentes = data as AgenteDTO[];
    return (
        <Page title="Agentes" action={<Link to="/agentes/create"><EuiButton size="s" fill> AGREGAR </EuiButton></Link>}>
            <Loading loading={loading}>
                <EuiFlexGrid columns={3}>
                    {
                        agentes ? agentes.map((agente) => {
                            return (
                                <EuiFlexItem key={agente.id}>
                                    <AgenteItemCard agente={agente} />
                                </EuiFlexItem>
                            );
                        }) : null


                    }
                </EuiFlexGrid>
            </Loading>
        </Page>

    )
}

export function AgenteItemCard({ agente }: { agente: AgenteDTO }) {
    const history = useHistory();
    const navigateTo = (agente) => {
        history.push(`/agentes/${agente.id}`);
    }

    return (
        <EuiCard
            title={agente.nombre}
            description={agente.documento}
            image={
                <div>
                    <img
                        src={`${environment.API}api/images/${agente.foto}`}
                        alt="Nature"
                        style={{ height: '150px' }}
                    />
                </div>
            }
            footer={
                <EuiFlexGroup justifyContent="flexEnd">
                    <EuiFlexItem grow={false}>
                        <EuiButton iconType="documentEdit" onClick={() => navigateTo(agente)}>Edit</EuiButton>
                    </EuiFlexItem>
                </EuiFlexGroup>
            }
        />
    )
}