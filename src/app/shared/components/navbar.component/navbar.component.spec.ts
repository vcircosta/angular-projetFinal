import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../core/services/auth.service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const authSpy = jasmine.createSpyObj('AuthService', ['logout', 'currentUser']);
        const routerMock = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [NavbarComponent],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: Router, useValue: routerMock },
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { paramMap: { get: () => null } } }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;

        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('✅ devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('✅ should detect admin user', () => {
        authServiceSpy.currentUser.and.returnValue({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' });
        expect(component.isAdmin()).toBeTrue();
    });

    it('✅ should detect non-admin user', () => {
        authServiceSpy.currentUser.and.returnValue({ id: 2, name: 'User', email: 'user@example.com', role: 'user' });
        expect(component.isAdmin()).toBeFalse();
    });

    it('✅ should call logout and navigate to /login', () => {
        component.logout();
        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
});
