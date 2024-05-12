import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';
import User from './User';

class AllCode extends Model {
    // public static associate(models: any): void {
    //     // AllCode.hasMany(models.Course);
    //     AllCode.hasMany(User, { foreignKey: 'roleId', as: 'roleData' }); // Chỉ rõ khóa ngoại của role
    //     AllCode.hasMany(User, { foreignKey: 'addressId', as: 'addressData' }); // Chỉ rõ khóa ngoại của address
    //     // AllCode.hasMany(models.Question);
    //     // AllCode.hasMany(models.Parent);
    //     // AllCode.hasMany(models.Student);
    //     // AllCode.hasMany(models.Exam);
    // }
}

AllCode.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.STRING,
        },
        title: {
            type: DataTypes.STRING,
        },
        code: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'AllCode',
    },
);

export default AllCode;
