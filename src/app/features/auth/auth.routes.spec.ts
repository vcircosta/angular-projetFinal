import { AUTH_ROUTES } from './auth.routes';
import { LoginComponent } from './login.component/login.component';
import { RegisterComponent } from './register.component/register.component';

describe('AUTH_ROUTES', () => {
    it('✅ doit définir la route de login', () => {
        const loginRoute = AUTH_ROUTES.find(r => r.path === 'login');
        expect(loginRoute).toBeDefined();
        expect(loginRoute?.component).toBe(LoginComponent);
    });

    it('✅ doit définir la route de register', () => {
        const registerRoute = AUTH_ROUTES.find(r => r.path === 'register');
        expect(registerRoute).toBeDefined();
        expect(registerRoute?.component).toBe(RegisterComponent);
    });

    it('🚫 ne doit pas avoir d\'autres routes inattendues', () => {
        const paths = AUTH_ROUTES.map(r => r.path);
        expect(paths).toEqual(['login', 'register']);
    });
});
