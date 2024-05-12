export interface IPayloadJWT {
    id: number;
    email: string;
    role: string;
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
}
