export interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
  token?: string;
}