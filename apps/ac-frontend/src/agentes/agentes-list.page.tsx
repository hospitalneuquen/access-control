import React, { useState } from 'react';
import { Page } from '../components/page';
import { Loading } from '../components/loading';
import { EuiFlexGroup, EuiFlexItem, EuiButton, EuiCard, EuiFlexGrid, EuiFieldText, EuiSpacer } from '@elastic/eui';
import { Link, useHistory } from 'react-router-dom';
import { useFetchAgentes } from './agente-api';
import { AgenteDTO } from '@access-control/agentes';

export function AgentesListPage() {
    const [search, setSearch] = useState('');
    const { status, data, isFetching } = useFetchAgentes(search);

    const loading = status === 'loading';
    const agentes = data as AgenteDTO[];
    return (
        <Page key="agentes-page" title="Agentes" action={<Link to="/agentes/create"><EuiButton size="s" fill> AGREGAR </EuiButton></Link>}>
            <EuiFieldText
                key="input"
                name="nombre"
                value={search}
                onChange={value => setSearch(value.target.value)}
                fullWidth
            />
            <EuiSpacer></EuiSpacer>
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
            // image={
            //     <div>
            //         <img
            //             src={`${environment.API}api/images/${agente.foto}`}
            //             alt="Nature"
            //             style={{ height: '150px' }}
            //         />
            //     </div>
            // }
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