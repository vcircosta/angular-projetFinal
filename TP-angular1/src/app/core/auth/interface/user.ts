export interface User {
    id: number;
    username: string;
    role: Role;
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

