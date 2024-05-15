import User from '~/models/User';
import AllCode from '~/models/AllCode';
import Answer from '~/models/Answer';
import Calendar from '~/models/Calendar';
import CalendarTeacher from '~/models/CalendarTeacher';
import Course from '~/models/Course';
import Exam from '~/models/Exam';
import ExamQuestion from '~/models/ExamQuestion';
import Parent from '~/models/Parent';
import Student from '~/models/Student';
import { sequelize } from './connectDB';
import Question from '~/models/Question';
import StudentCourse from '~/models/StudentCourse';

(async () => {
    try {
        await sequelize.sync(); // Đồng bộ hóa các mô hình với cơ sở dữ liệu
        // await Promise.all([await User.sync() ,await AllCode.sync(),await Answer.sync(), await Calendar.sync() , await CalendarTeacher.sync() , await Course.sync() , await Exam.sync() , await ExamQuestion.sync() , await ExamStudent.sync(),await Parent.sync() , await Student.sync()]);
        const modals = [
            User,
            AllCode,
            Answer,
            Calendar,
            CalendarTeacher,
            Course,
            Exam,
            ExamQuestion,
            Parent,
            Question,
            Student,
            StudentCourse,
        ];
        await Promise.all(modals.map((modal) => modal.sync()));
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        sequelize.close(); // Đóng kết nối sau khi hoàn thành
    }
})();
