import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';
import Question from './Question';

class Answer extends Model {}
Answer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        answer_title: {
            type: DataTypes.STRING,
        },
        is_right: {
            type: DataTypes.BOOLEAN,
        },
        question_id:{
            type:DataTypes.INTEGER
        },
    },
    {
        sequelize,
        modelName: 'Answer',
    },
);

Answer.belongsTo(Question,{
    foreignKey:"question_id",
    targetKey:'id',
    as:'answerData'
})

export default Answer;
