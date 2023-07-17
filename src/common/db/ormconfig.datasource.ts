import { DataSource } from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import {config} from 'dotenv';
config();

export const ormConfig = (): MysqlConnectionOptions => ({
    type: "mysql",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: false,
    entities: [__dirname + '../../../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/migrations/**/*.{js,ts}']

})

const datasource: DataSource = new DataSource(ormConfig())

export default datasource;