import { AgenteDTO } from '@access-control/agentes';
import { environment } from '../environments/environment';
import { useQuery } from 'react-query';

export function agenteCreateUpdate(agente: AgenteDTO) {
    const idUrl = agente.id ? `/${agente.id}` : '';
    const url = `${environment.API}api/agentes${idUrl}`;

    return fetch(url, {
        method: agente.id ? 'PATCH' : 'POST',
        body: JSON.stringify(agente),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(res => res.json())
}

export function getAgenteById(id: string) {
    const url = `${environment.API}api/agentes/${id}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(res => res.json())
}

export function useFetchAgentes(search: any) {
    const fetchAgentes: any = (key, search) => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (!search) {
            return Promise.resolve([]);
        }
        let p;
        if (!isNaN(search)) {
            p = fetch(`${environment.API}api/agentes?documento=${search}`, { signal }).then(res => res.json());
        } else {
            p = fetch(`${environment.API}api/agentes?nombre=${search}`, { signal }).then(res => res.json());
        }
        p.cancel = () => controller.abort();
        return p;
    };
    return useQuery(['agentes', search], fetchAgentes);
}