export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export interface User {
    username: string;
    id?: number;
    role?: Role;
}