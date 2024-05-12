import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class Student extends Model {
    static associate(models : any) {
        Student.hasMany(models.Parent);
        Student.hasMany(models.CalendarTeacher);
        Student.belongsTo(models.AllCode, {
            foreignKey: "address"
        })
    }
}

Student.init(
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
        phoneNumber:{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        birthday:{
            type:DataTypes.STRING
        },
        gender:{
            type:DataTypes.BOOLEAN
        },
        password:{
            type:DataTypes.STRING
        },
        avatar:{
            type:DataTypes.STRING
        },
        level :{
            type:DataTypes.INTEGER
        },
        address:{
            type:DataTypes.INTEGER
        },
        address_detail:{
            type:DataTypes.STRING
        },
    },
    {
        sequelize,
        modelName: 'Student',
    },
);

export default Student;
