import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class AllCode extends Model {
    static associate(models: any) {
        AllCode.hasMany(models.Course);
        AllCode.hasMany(models.User);
        AllCode.hasMany(models.Question);
        AllCode.hasMany(models.Parent);
        AllCode.hasMany(models.Student);
        AllCode.hasMany(models.Exam);
    }
}

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
