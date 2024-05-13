import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';
import AllCode from './AllCode';
import Student from './Student';

class Parent extends Model {}

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

Parent.belongsTo(AllCode, {
    foreignKey: "association_for_student",
    targetKey:'id',
    as:"AssociationData"
});
Parent.belongsTo(Student, {
    foreignKey: "child",
    targetKey:'id',
    as:'ParentData'
});

export default Parent;
