import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class CalendarTeacher extends Model {
    static associate(models : any) {
        CalendarTeacher.belongsTo(models.Calendar, {
            foreignKey: "calendar_id"
        })
        CalendarTeacher.belongsTo(models.User, {
            foreignKey:"teacher_id"
        })
        CalendarTeacher.belongsTo(models.Student, {
            foreignKey:"student_id"
        })
    }
}

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
        student_id:{
            type:DataTypes.INTEGER
        },
        day:{
            type:DataTypes.STRING
        },
        is_reservation :{
            type:DataTypes.BOOLEAN
        },
        is_confirm:{
            type:DataTypes.BOOLEAN
        },
        is_interviewed_meet:{
            type:DataTypes.BOOLEAN
        },
    },
    {
        sequelize,
        modelName: 'CalendarTeacher',
    },
);

export default CalendarTeacher;
