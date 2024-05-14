import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';
import AllCode from './AllCode';
import Student from './Student';
import User from './User';

class Exam extends Model {}

Exam.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING,
        },
        student_id: {
            type: DataTypes.STRING,
        },
        title: {
            type: DataTypes.STRING,
        },
        time_end: {
            type: DataTypes.INTEGER,
        },
        correct_result_count: {
            type: DataTypes.INTEGER,
        },
        total_question: {
            type: DataTypes.INTEGER,
        },
        total_result: {
            type: DataTypes.INTEGER,
        },
        level: {
            type: DataTypes.INTEGER,
        },
        teacher_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize,
        modelName: 'Exam',
    },
);

Exam.belongsTo(AllCode, {
    foreignKey: 'level',
    targetKey: 'id',
    as: 'levelData',
});

Exam.belongsTo(Student, {
    foreignKey: 'student_id',
    targetKey: 'id',
    as: 'studentData',
});

Student.hasMany(Exam, {
    foreignKey: 'student_id',
    as: 'examData',
});

Exam.belongsTo(User, {
    foreignKey: 'teacher_id',
    targetKey: 'id',
    as: 'teacherData',
});

User.hasMany(Exam, {
    foreignKey: 'teacher_id',
    as: 'examData',
});

export default Exam;
