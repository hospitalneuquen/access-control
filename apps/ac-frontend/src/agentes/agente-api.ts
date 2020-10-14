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

export function agenteSync(agente: AgenteDTO, tags = ["fichada"]) {
    const url = `${environment.API}api/devices-sync/sync`;

    const data = {
        "agenteId": agente.id,
        "tags": tags
    }

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
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

export function useFetchAgentes(search?: string) {
    const fetchAgentes: any = (key, search: string) => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (!search || search.length < 3) {
            return Promise.resolve([]);
        }
        let p;
        if (!isNaN(search as any)) {
            p = fetch(`${environment.API}api/agentes?documento=${search}`, { signal }).then(res => res.json());
        } else {
            p = fetch(`${environment.API}api/agentes?nombre=${search}`, { signal }).then(res => res.json());
        }
        p.cancel = () => controller.abort();
        return p;
    };
    return useQuery(['agentes', search], fetchAgentes);
}