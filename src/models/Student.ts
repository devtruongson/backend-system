import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';
import AllCode from './AllCode';

class Student extends Model {}

Student.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },

        fullName: {
            type: DataTypes.STRING,
        },
        phoneNumber: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        birthday: {
            type: DataTypes.STRING,
        },
        gender: {
            type: DataTypes.BOOLEAN,
        },
        password: {
            type: DataTypes.STRING,
        },
        avatar: {
            type: DataTypes.STRING,
        },
        level: {
            type: DataTypes.INTEGER,
        },
        address: {
            type: DataTypes.INTEGER,
        },
        address_detail: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'Student',
    },
);

Student.belongsTo(AllCode, {
    foreignKey: 'address',
    targetKey: 'id',
    as: 'AllCodeData',
});

AllCode.hasMany(Student, {
    foreignKey: 'address',
    as: 'StudentData',
});

export default Student;
