export interface IPayloadJWT {
    id: number;
    email: string;
    role: number;
    role_detail: string;
    phoneNumber: string;
    is_login_social: boolean;
}

export interface IUser {
    id: number;
    role: number;
    address: number;
    address_detail: string;
    phoneNumber: string;
    code: string;
    email: string;
    password: string;
    avatar: string;
    is_login_social: boolean;
    age: string;
    gender: boolean;
    roleData?: {
        type: string;
        title: string;
        code: string;
    };
}
