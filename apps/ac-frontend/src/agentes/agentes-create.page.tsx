import React, { useState, useEffect } from 'react';
import { Page } from '../components/page';
import { useHistory, useParams } from 'react-router-dom';
import { AgentesForm } from './agentes-form';
import { getAgenteById } from './agente-api';
import { Loading } from '../components/loading';

export function AgentesCreatePage() {
    const history = useHistory();
    return (
        <Page title="Nuevo Agente">
            <AgentesForm done={() => history.replace('/agentes')}  ></AgentesForm>
        </Page>
    )
}

export function AgentesUpdatePage() {
    const history = useHistory();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [agente, setAgente] = useState(null);

    useEffect(() => {
        setLoading(true);
        getAgenteById(id).then((agente) => {
            setAgente(agente);
            setLoading(false);
        })
    }, [id]);

    return (
        <Page title="Editar Agente">
            <Loading loading={loading}>
                {
                    agente ?
                        <AgentesForm agente={agente} done={() => history.replace('/agentes')}></AgentesForm>
                        : null
                }
            </Loading>
        </Page>
    )
}
