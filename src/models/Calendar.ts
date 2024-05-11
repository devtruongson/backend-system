import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connectDB';

class Calendar extends Model {
    static associate(models : any) {
        Calendar.hasMany(models.CalendarTeacher)
    }
}

Calendar.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        time_start: {
            type: DataTypes.STRING,
            
        },
        time_end: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'Calendar',
    },
);

export default Calendar;
