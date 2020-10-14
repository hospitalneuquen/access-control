import { EuiButton, EuiCheckboxGroup } from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Loading } from '../components/loading';
import { Page } from '../components/page';
import { getTags } from '../tags/tag-api';
import { agenteSync, getAgenteById } from './agente-api';

export function AgentesSyncPage() {
    const history = useHistory();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [agente, setAgente] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagsSelected, setTagsSelected] = useState({});

    useEffect(() => {
        setLoading(true);
        getAgenteById(id).then((agente) => {
            setAgente(agente);
            setLoading(false);
        })
    }, [id]);

    useEffect(() => {
        getTags().then(tags => setTags(tags))
    }, []);

    useEffect(() => {
        if (agente) {
            const ss = agente.tags.reduce((a, c) =>  ({ ...a, [c]: true })  , {});
            setTagsSelected(ss);
        }
    }, [agente]);

    const onChange = (optionId) => {
        const ss = {
            ...tagsSelected,
            [optionId]: !tagsSelected[optionId]
        }
        setTagsSelected(ss);
    }

    const onSave = () => {  
        const tags = Object.entries(tagsSelected).filter(([k, v]) => v).map(([k]) => k);
        agenteSync(agente, tags);
    }

    return (
        <Page title={"Sincronizar Agente: " + agente?.nombre + ' ' + agente?.documento}>
            <Loading loading={loading}>
                {
                    agente && tags.length > 0 && <EuiCheckboxGroup
                    options={tags.map(t => ({ id: t, label: t }))}
                    idToSelectedMap={tagsSelected}
                    onChange={onChange}
                  />                        
                }
                <EuiButton onClick={onSave}>
                    GRABAR
                </EuiButton>
            </Loading>
        </Page>
    )
}