import { environment } from '../environments/environment';

export function getTags() {
    const url = `${environment.API}api/tags`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(res => res.json())
}