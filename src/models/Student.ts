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
        province: {
            type: DataTypes.STRING,
        },
        district: {
            type: DataTypes.STRING,
        },
        commune: {
            type: DataTypes.STRING,
        },
        address_detail: {
            type: DataTypes.STRING,
        },
        course_code: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'Student',
    },
);

// Student.belongsTo(AllCode, {
//     foreignKey: 'course_code',
//     targetKey: 'id',
//     as: 'AllCodeData',
// });

// AllCode.hasMany(Student, {
//     foreignKey: 'course_code',
//     as: 'StudentData',
// });

export default Student;
