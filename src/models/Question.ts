import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class Question extends Model {
    static associate(models : any) {
        Question.hasMany(models.Answer);
        Question.belongsTo(models.AllCode, {
            foreignKey:"level"
        });
        Question.hasMany(models.ExamQuestion);
        Question.belongsTo(models.User , {
            foreignKey:"author_id"
        })
    }
}

Question.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
        },
        file: {
            type: DataTypes.STRING,
        },
        suggest:{
            type:DataTypes.STRING
        },
        level:{
            type:DataTypes.INTEGER
        },
        author_id :{
            type:DataTypes.INTEGER
        },
    },
    {
        sequelize,
        modelName: 'Question',
    },
);

export default Question;
