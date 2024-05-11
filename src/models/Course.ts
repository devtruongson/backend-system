import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class Course extends Model {
    static associate(models : any) {
        Course.belongsTo(models.AllCode, {
            foreignKey:"training_sector"

        })
    }
}

Course.init(
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
        code: {
            type: DataTypes.STRING,
        },
        is_free:{
            type:DataTypes.BOOLEAN
        },
        is_try_learning:{
            type:DataTypes.BOOLEAN
        },
        price :{
            type:DataTypes.STRING
        },
        thumbnail:{
            type:DataTypes.STRING
        },
        training_sector:{
            type:DataTypes.INTEGER
        },
        discount:{
            type:DataTypes.STRING
        },
    },
    {
        sequelize,
        modelName: 'Course',
    },
);

export default Course;
