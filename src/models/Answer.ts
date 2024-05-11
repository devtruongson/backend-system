import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class Answer extends Model {
    static associate(models : any) {
        Answer.belongsTo(models.Question,{
            foreignKey:"question_id"

        })
    }
}
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

export default Answer;
