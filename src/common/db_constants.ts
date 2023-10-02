import { Dialect, Options } from 'sequelize/types';
export const PORT = Number(process.env.PORT || 5000);

const databaseName =
    process.env.NODE_ENV === 'test'
        ? process.env.TEST_DB_NAME
        : process.env.NODE_ENV === 'production'
        ? process.env.PROD_DB_NAME
        : process.env.DEV_DB_NAME;

export const SEQUELIZE_CONFIGS: Options = {
    dialect: String(process.env.DB_TYPE || 'mysql') as Dialect,
    database: String(databaseName),
    host: String(process.env.DB_HOST || 'localhost'),
    port: Number(process.env.DB_PORT || 3306),
    username: String(process.env.DB_USER || 'root'),
    password: String(process.env.DB_PASSWORD || ''),
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        underscored: true,
        freezeTableName: true,
    },
    logging: (msg) => {
        if (msg.startsWith('Executing (default): SELECT 1+1 AS result')) {
            console.log('Successfully connected to database');
        } else if (msg.includes('error')) {
            console.error(msg);
        } else {
            console.log(msg);
        }
    },
};
