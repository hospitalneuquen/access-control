import { environment } from '../environments/environment';
import { Moment } from 'moment';

export function syncClocks(fromDate: Moment, toDate: Moment, selectedAgents: String[]): Promise<any> {
    const url = `${environment.API}api/devices-sync/relojes`;

    const data = {
        desde: fromDate.format('YYYY-MM-DD'),
        hasta: toDate.format('YYYY-MM-DD'),
        documentos: selectedAgents
    };

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    }).then((res) => res.json());
}
