import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class ExamQuestion extends Model {
    static associate(models : any) {
        ExamQuestion.belongsTo(models.Exam , {
            foreignKey:"exam_id"
        })
        ExamQuestion.belongsTo(models.Question , {
            foreignKey:'question_id'
        })
    }
}

ExamQuestion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        exam_id: {
            type: DataTypes.INTEGER,
        },
        question_id: {
            type: DataTypes.INTEGER,
        },
        is_right:{
            type:DataTypes.BOOLEAN
        },
    },
    {
        sequelize,
        modelName: 'ExamQuestion',
    },
);

export default ExamQuestion;
