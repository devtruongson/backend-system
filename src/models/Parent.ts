import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class Parent extends Model {
    static associate(models : any) {
        Parent.belongsTo(models.AllCode, {
            foreignKey: "association_for_student"
        });
        Parent.belongsTo(models.Student, {
            foreignKey: "child"
        });
    }
}

Parent.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        fullName: {
            type: DataTypes.STRING,
            
        },
        association_for_student: {
            type: DataTypes.INTEGER,
        },
        child:{
            type:DataTypes.INTEGER
        },
    },
    {
        sequelize,
        modelName: 'Parent',
    },
);

export default Parent;
