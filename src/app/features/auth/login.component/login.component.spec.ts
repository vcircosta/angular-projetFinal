import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        const authSpy = jasmine.createSpyObj('AuthService', ['login']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: Router, useValue: routerSpy },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;

        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture.detectChanges();
    });

    it('✅ devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('🚫 ne doit pas soumettre si le formulaire est invalide', () => {
        component.form.setValue({ email: '', password: '' });
        component.onSubmit();
        expect(authService.login).not.toHaveBeenCalled();
    });

    it('🚫 doit gérer les erreurs de login', fakeAsync(() => {
        const error = new Error('Email ou mot de passe invalide');
        authService.login.and.returnValue(throwError(() => error));

        component.form.setValue({ email: 'wrong@example.com', password: 'badpass' });
        component.onSubmit();
        tick();

        expect(authService.login).toHaveBeenCalled();
        expect(component.errorMessage).toBe('Email ou mot de passe invalide');
        expect(component.loading).toBeFalse();
        expect(router.navigate).not.toHaveBeenCalled();
    }));
});
