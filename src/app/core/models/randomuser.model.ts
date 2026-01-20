export interface RandomUser {
    id: string;
    name: string;
    email: string;
    location: string;
    role: 'user' | 'admin';
}