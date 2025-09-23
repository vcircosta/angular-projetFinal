import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { throwError } from 'rxjs';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
        const authSpy = jasmine.createSpyObj('AuthService', ['register']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [RegisterComponent, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    it('✅ devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('🚫 ne doit pas soumettre si le formulaire est invalide', () => {
        component.form.setValue({ name: '', email: '', password: '', confirmPassword: '' });
        component.onSubmit();
        expect(authService.register).not.toHaveBeenCalled();
    });

    it('🚫 doit gérer une erreur du service', fakeAsync(() => {
        const formData = { name: 'Alice', email: 'alice@test.com', password: '1234', confirmPassword: '1234' };
        component.form.setValue(formData);

        const error = new Error('Email déjà utilisé');
        authService.register.and.returnValue(throwError(() => error));

        spyOn(console, 'error');

        component.onSubmit();
        tick();

        expect(console.error).toHaveBeenCalledWith(error);
    }));
});
