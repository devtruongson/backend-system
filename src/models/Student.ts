import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';
import AllCode from './AllCode';
import User from './User';

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
        sale_created_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize,
        modelName: 'Student',
    },
);

Student.belongsTo(User, {
    foreignKey: 'sale_created_id',
    targetKey: 'id',
    as: 'SaleData',
});

User.hasMany(Student, {
    foreignKey: 'sale_created_id',
    as: 'StudentData',
});

export default Student;
