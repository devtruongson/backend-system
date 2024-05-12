import User from '~/models/User';

class UserService {
    async createUserService() {
        try {
            await User.create({
                role: 1,
                address: 1,
                address_detail: 1,
                phoneNumber: '123',
                code: '123',
                email: 'email',
                password: '123',
                avatar: '123',
                is_login_social: false,
                age: 20,
                gender: true,
            });

            return 'success';
        } catch (err) {
            console.log(err);
        }
    }
}

export default new UserService();
