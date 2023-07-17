import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
dotenv.config();

import { ormConfig } from './ormconfig.datasource';


const seedDataSource: DataSource = new DataSource({
    ...ormConfig(),
    migrations: [__dirname + '/seeds/**/*{.ts,.js}'],
});

export default seedDataSource;