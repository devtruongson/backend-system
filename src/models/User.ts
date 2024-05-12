import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class User extends Model {
    static associate(models : any) {
        User.hasMany(models.CalendarTeacher)
        User.hasMany(models.Question)
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
            allowNull: true,
        },
        address: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        address_detail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_login_social: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        age: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
    },
);

export default User;
