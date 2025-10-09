import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();


export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_SERVER,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: true,
    cache: true,
    
});
