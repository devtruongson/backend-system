import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';
import Calendar from './Calendar';
import User from './User';
import Student from './Student';
import StudentCourse from './StudentCourse';

class CalendarTeacher extends Model {}

CalendarTeacher.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        teacher_id: {
            type: DataTypes.INTEGER,
        },

        calendar_id: {
            type: DataTypes.INTEGER,
        },

        student_id: {
            type: DataTypes.INTEGER,
        },

        day: {
            type: DataTypes.STRING,
        },

        time_stamp_start: {
            type: DataTypes.STRING,
        },

        time_stamp_end: {
            type: DataTypes.STRING,
        },

        is_reservation: {
            type: DataTypes.BOOLEAN,
        },

        is_confirm: {
            type: DataTypes.BOOLEAN,
        },

        is_interviewed_meet: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize,
        modelName: 'CalendarTeacher',
    },
);

CalendarTeacher.belongsTo(Calendar, {
    foreignKey: 'calendar_id',
    targetKey: 'id',
    as: 'calendarData',
});
CalendarTeacher.belongsTo(User, {
    foreignKey: 'teacher_id',
    targetKey: 'id',
    as: 'teacherData',
});
CalendarTeacher.belongsTo(Student, {
    foreignKey: 'student_id',
    targetKey: 'id',
    as: 'studentData',
});

export default CalendarTeacher;
