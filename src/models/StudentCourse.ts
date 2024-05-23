import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';
import Student from './Student';
import Course from './Course';
import CalendarTeacher from './CalendarTeacher';

class StudentCourse extends Model {}

StudentCourse.init(
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
        course_id: {
            type: DataTypes.INTEGER,
        },
        calendar_id: {
            type: DataTypes.INTEGER,
        },
        is_confirm: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize,
        modelName: 'StudentCourse',
    },
);

StudentCourse.belongsTo(Student, {
    foreignKey: 'student_id',
    targetKey: 'id',
    as: 'StudentData',
});

Student.hasMany(StudentCourse, {
    foreignKey: 'student_id',
    as: 'StudentCourseData',
});

StudentCourse.belongsTo(Course, {
    foreignKey: 'course_id',
    targetKey: 'id',
    as: 'CourseData',
});

Course.hasMany(StudentCourse, {
    foreignKey: 'course_id',
    as: 'StudentCourseData',
});

StudentCourse.belongsTo(CalendarTeacher, {
    foreignKey: 'calendar_id',
    as: 'CalendarTeacherData',
});

CalendarTeacher.hasOne(StudentCourse, {
    foreignKey: 'calendar_id',
    as: 'StudentCourseData',
});

export default StudentCourse;
