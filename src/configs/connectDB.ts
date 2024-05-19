import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('system_manage', 'sa', '123456', {
    dialect: 'mssql',
    host: 'localhost',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
    },
    logging: false,
});

export default async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
