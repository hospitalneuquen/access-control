import { AgenteDTO } from '@access-control/agentes';
import { environment } from '../environments/environment';
import { useInfiniteQuery, useQuery } from 'react-query';

export function agenteCreate(agente: AgenteDTO) {
    const url = `${environment.API}api/agentes`;

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(agente),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(res => res.json())

}

export function useFetchAgentes() {
    const fetchAgentes: any = (key, cursor = 0) => fetch(`${environment.API}api/agentes`).then(res => res.json())
    return useQuery('agentes', fetchAgentes);
}