import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConfig = (): TypeOrmModuleOptions =>({
    type: 'mysql',
    host: process.env.DB_SERVER,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: true,
    cache:true
})