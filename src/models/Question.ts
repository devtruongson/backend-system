import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';
import AllCode from './AllCode';
import User from './User';

class Question extends Model {}

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
        suggest: {
            type: DataTypes.STRING,
        },
        level: {
            type: DataTypes.INTEGER,
        },
        author_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize,
        modelName: 'Question',
    },
);

Question.belongsTo(AllCode, {
    foreignKey: 'level',
    targetKey: 'id',
    as: 'levelData',
});

Question.belongsTo(User, {
    foreignKey: 'author_id',
    targetKey: 'id',
    as: 'authorData',
});

User.hasMany(Question, {
    foreignKey: 'author_id',
    as: 'questions',
});

export default Question;
