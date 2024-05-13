import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class AllCode extends Model {}

AllCode.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.STRING,
        },
        title: {
            type: DataTypes.STRING,
        },
        code: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'AllCode',
    },
);

export default AllCode;
