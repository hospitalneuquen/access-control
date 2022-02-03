import { format } from 'date-fns';
import * as DigestFetch from 'digest-fetch';
import * as querystring from 'querystring';
import { createDTO, PhotoDTO, UserDTO } from './create-user-dto';

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

    private async post(url: string, body: any = {}, params: { [key: string]: any } = {}) {
        const qs = querystring.stringify({
            format: 'json',
            ...params
        });  
        return this.client
            .fetch(`${this.url}${url}?${qs}`, {
                method: 'POST',
                body: JSON.stringify(body)
            })
            .then((res) => res.text())
            .then((respuesta) => JSON.parse(respuesta));
    }

    private async put(url: string, body: any = {}, params: { [key: string]: any } = {}) {
        const qs = querystring.stringify({
            format: 'json',
            ...params
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

    public async getAll() {
        let usuarios = [];
        let contador = 0;
        const total = await this.count(); 

        while (total > contador) {
            const us = await this.listUser({ skip: contador, limit: 30 }); 
            contador += us.length;
            usuarios = [...usuarios, ...us]; 
        }
        return usuarios;
    }

    public async listUser({ limit, skip }: { limit: number; skip: number }) {
        const time = '' + Date.now();
        const body = { UserInfoSearchCond: { searchID: time, searchResultPosition: skip, maxResults: limit } };
        const response = await this.post('/ISAPI/AccessControl/UserInfo/Search', body);
        return response.UserInfoSearch?.UserInfo || [];
    }

    public async getPhoto(employeeNo: string) {
        const data = {
            FDID: '1',
            faceLibType: 'blackFD',
            searchResultPosition: 0,
            maxResults: 3,
            FPID: employeeNo
        };
        const { MatchList } = await this.post('/ISAPI/Intelligent/FDLib/FDSearch', data);
        const user = MatchList[0];
        return await this.client.fetch(user?.faceURL);
    }

    public async addPhoto(user: PhotoDTO) {
        const data = {
            faceLibType: 'blackFD',
            FDID: '1',
            FPID: user.id,
            name: user.name,
            faceURL: user.url
        };
        const response = await this.post('/ISAPI/Intelligent/FDLib/FaceDataRecord', data);
        return response;
    }

    public async deletePhoto(userID: string) {
        const params = {
            FDID: '1',
            faceLibType: 'blackFD'
        };
        const imageBodyDelete = { FPID: [{ value: userID }] };
        const response = await this.put('/Intelligent/FDLib/FDSearch/Delete', imageBodyDelete, params);
        return response;
    }

    public async getEvents(start: Date, end: Date, agenteId: string = undefined) {
        const startTime = format(start, "yyyy-MM-dd'T'HH:mm:ssxxx");
        const endTime = format(end, "yyyy-MM-dd'T'HH:mm:ssxxx");
        const time = '' + Date.now();
        const body = {
            AcsEventCond: {
                searchID: time,
                searchResultPosition: 0,
                maxResults: 500,
                major: 5,
                minor: 75,
                startTime,
                endTime,
                employeeNoString: agenteId
            }
        };
        const response = await this.post('/ISAPI/AccessControl/AcsEvent', body); 
        const list = response.AcsEvent.InfoList || []; 
        return list.map((evt) => {
            return {
                agenteId: evt.employeeNoString,
                datetime: evt.time,
                url: evt.pictureURL,
                attendanceStatus: evt.attendanceStatus
            };
        });
    }
}
