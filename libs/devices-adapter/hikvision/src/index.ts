import * as DigestFetch from 'digest-fetch';
import * as querystring from 'querystring';
import { UserDTO, createDTO } from './create-user-dto';

export interface HikVisionOptions {
    host: string;
    port: number;
    user: string;
    password: string;
}

export class HikVisionDevice {
    private client;
    private url: string;
    constructor(options: HikVisionOptions) {
        this.client = new DigestFetch(options.user, options.password);
        this.url = `http://${options.host}:${options.port}`;
    }

    private async get(url: string, params: { [key: string]: any } = {}) {
        const qs = querystring.stringify({
            ...params,
            format: 'json'
        });
        return this.client
            .fetch(`${this.url}${url}?${qs}`, {
                method: 'GET'
            })
            .then((res) => res.text())
            .then((respuesta) => JSON.parse(respuesta));
    }

    private async post(url: string, body: any = {}) {
        const qs = querystring.stringify({
            format: 'json'
        });
        return this.client
            .fetch(`${this.url}${url}?${qs}`, {
                method: 'POST',
                body: JSON.stringify(body)
            })
            .then((res) => res.text())
            .then((respuesta) => JSON.parse(respuesta));
    }

    private async put(url: string, body: any = {}) {
        const qs = querystring.stringify({
            format: 'json'
        });
        return this.client
            .fetch(`${this.url}${url}?${qs}`, {
                method: 'PUT',
                body: JSON.stringify(body)
            })
            .then((res) => res.text())
            .then((respuesta) => JSON.parse(respuesta));
    }

    public async count(): Promise<number> {
        const response = await this.get('/ISAPI/AccessControl/UserInfo/Count');
        return response?.UserInfoCount?.userNumber;
    }

    public async addUser(user: UserDTO) {
        const data = createDTO(user);
        const response = await this.post('/ISAPI/AccessControl/UserInfo/Record', data);
        return response;
    }

    public async deleteUser(userID: string) {
        const bodyDelete = { UserInfoDelCond: { EmployeeNoList: [{ employeeNo: userID }] } };
        const response = await this.put('/ISAPI/AccessControl/UserInfo/Delete', bodyDelete);
        return response;
    }
}
