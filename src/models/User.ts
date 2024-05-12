import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class User extends Model {
    static associate(models : any) {
        User.hasMany(models.CalendarTeacher)
        User.belongsTo(models.AllCode , {
            foreignKey:"role"
        })
        User.belongsTo(models.AllCode , {
            foreignKey:"address"
        })    
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        role: {
            type: DataTypes.INTEGER,
        },
        address: {
            type: DataTypes.INTEGER,
        },
        address_detail:{
            type:DataTypes.STRING
        },
        phoneNumber:{
            type:DataTypes.STRING
        },
        code :{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        password:{
            type:DataTypes.STRING
        },
        avatar:{
            type:DataTypes.STRING
        },
        is_login_social:{
            type:DataTypes.BOOLEAN
        },
        age:{
            type:DataTypes.STRING
        },
        gender:{
            type:DataTypes.BOOLEAN
        },
    },
    {
        sequelize,
        modelName: 'User',
    },
);

export default User;
