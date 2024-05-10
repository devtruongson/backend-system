import User from '~/models/User';
import { sequelize } from './connectDB';

(async () => {
    try {
        await sequelize.sync(); // Đồng bộ hóa các mô hình với cơ sở dữ liệu
        await Promise.all([await User.sync()]);
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        sequelize.close(); // Đóng kết nối sau khi hoàn thành
    }
})();
