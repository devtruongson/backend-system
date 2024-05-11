import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class Question extends Model {
    static associate(models : any) {
        Question.belongsTo(models.AllCode, {
            foreignKey:"level"
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
        author :{
            type:DataTypes.INTEGER
        },
    },
    {
        sequelize,
        modelName: 'Question',
    },
);

export default Question;
