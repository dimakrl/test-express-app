import {CONFIG} from "./shared/app.config";
import {DataSource, DataSourceOptions} from "typeorm"

const ormconfig = {
    username: CONFIG.USER,
    password: CONFIG.PASSWORD,
    type: 'postgres',
    port: CONFIG.DB_PORT,
    host: CONFIG.ENDPOINT,
    logging: true,
    database: CONFIG.DATABASE_NAME,
    synchronize: CONFIG.TABLE_SCHEMA_AUTOUPDATE,
    migrationsTableName: 'migrations',
    migrationsRun: false,
    maxQueryExecutionTime: 3000,
    entities: CONFIG.IMPORT_JS_ENTITIES ? ['dist/handlers/**/*.entity.js'] : ['dist/handlers/**/*.entity.js', 'src/handlers/**/*.entity.ts'],
    migrations: ['dist/migrations/*.js'],
    ssl: process.env.SLL === 'true' ? {rejectUnauthorized: false} : false,
} as DataSourceOptions

export default new DataSource(ormconfig);