import * as dotenv from 'dotenv';

dotenv.config();

export const CONFIG = Object.freeze({
  ENDPOINT: process.env.ENDPOINT,
  USER: process.env.USER_NAME,
  DB_PORT: Number(process.env.DB_PORT),
  PASSWORD: process.env.PASSWORD,
  TABLE_SCHEMA_AUTOUPDATE: process.env.TABLE_SCHEMA_AUTOUPDATE === 'true',
  APP_VERSION: process.env.npm_package_version,
  DEVELOPMENT: process.env.DEVELOPMENT === 'true',
  IMPORT_JS_ENTITIES: process.env.IMPORT_JS_ENTITIES === 'true',
  PORT: Number(process.env.PORT),
  DATABASE_NAME: process.env.DATABASE_NAME,
  AWS_USER_ACCESS_KEY: process.env.AWS_USER_ACCESS_KEY,
  AWS_USER_SECRET_ACCESS_KEY: process.env.AWS_USER_SECRET_ACCESS_KEY,
  REGION: process.env.REGION,
  BUCKET_NAME: process.env.BUCKET_NAME,
});
