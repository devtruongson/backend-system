import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';
import Question from './Question';
import Exam from './Exam';

class ExamQuestion extends Model {}

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
        is_right: {
            type: DataTypes.BOOLEAN,
        },
        selected_answer: {
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize,
        modelName: 'ExamQuestion',
    },
);

ExamQuestion.belongsTo(Exam, {
    foreignKey: 'exam_id',
    targetKey: 'id',
    as: 'ExamData',
});

Exam.hasMany(ExamQuestion, {
    foreignKey: 'exam_id',
    as: 'ExamQuestionData',
});

ExamQuestion.belongsTo(Question, {
    foreignKey: 'question_id',
    targetKey: 'id',
    as: 'QuestionData',
});

export default ExamQuestion;
