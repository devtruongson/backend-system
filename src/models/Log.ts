import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';
import Student from './Student';
import User from './User';

class Log extends Model {}

Log.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },

        student_id: {
            type: DataTypes.INTEGER,
        },

        user_id: {
            type: DataTypes.INTEGER,
        },

        event: {
            type: DataTypes.STRING,
        },

        description: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'Log',
    },
);

Log.belongsTo(Student, {
    foreignKey: 'student_id',
    targetKey: 'id',
    as: 'StudentData',
});

Student.hasMany(Log, {
    foreignKey: 'student_id',
    as: 'LogData',
});

Log.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    as: 'SaleData',
});

User.hasMany(Log, {
    foreignKey: 'user_id',
    as: 'LogData',
});

export default Log;
