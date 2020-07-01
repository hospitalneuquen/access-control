import * as sql from 'mssql';

export class SQLServerExport {
    private pool: any;

    constructor(private config: SQLServerConfig) {}

    private async connect() {
        return sql.connect(this.config);
    }

    public async insert(table: string, data: any) {
        if (!this.pool) {
            this.pool = await this.connect();
        }

        const request = this.pool.request();
        const cols = [];
        const inputs = [];

        for (let k in data) {
            request.input(k, data[k]);
            cols.push(k);
            inputs.push('@' + k);
        }

        const query = `insert into ${table} (${cols.toString()}) values (${inputs.toString()})`;
        return request.query(query);
    }
}

export interface SQLServerConfig {
    user: string;
    password: string;
    server: string;
    port: number;
    database: string;
    connectionTimeout?: number;
    requestTimeout?: number;
}
