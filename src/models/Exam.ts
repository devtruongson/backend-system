import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class Exam extends Model {
    static associate(models : any) {
        Exam.hasMany(models.ExamQuestion);
    }
}

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
        student_id:{
            type : DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING,
        },
        time_end:{
            type:DataTypes.INTEGER
        },
        correct_result_count:{
            type:DataTypes.INTEGER
        },
        total_question :{
            type:DataTypes.INTEGER 
        },
        total_result:{
            type:DataTypes.INTEGER
        },
        level:{
            type:DataTypes.INTEGER
        },
        teacher_id:{
            type:DataTypes.INTEGER
        },
    },
    {
        sequelize,
        modelName: 'Exam',
    },
);

export default Exam;
