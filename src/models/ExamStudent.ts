import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class ExamStudent extends Model {
    static associate(models : any) {
    }
}

ExamStudent.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
        },
        exam_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize,
        modelName: 'ExamStudent',
    },
);

export default ExamStudent;
