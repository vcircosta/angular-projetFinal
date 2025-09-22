import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleBasedDirective } from './role-based.directive';
import { AuthService } from '../../../core/services/auth.service/auth.service';
import { of } from 'rxjs';

@Component({
    template: `<div *appRole="'user'">Content</div>`,
    standalone: true,
    imports: [RoleBasedDirective],
})
class TestComponent { }

describe('RoleBasedDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let authSpy: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
        authSpy = jasmine.createSpyObj('AuthService', ['currentUser']);
        authSpy.currentUser.and.returnValue({ id: 1, role: 'user', name: 'Test', email: 'test@example.com' });

        TestBed.configureTestingModule({
            imports: [TestComponent],
            providers: [{ provide: AuthService, useValue: authSpy }]
        });

        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    it('✅ devrait afficher le contenu pour user', () => {
        expect(fixture.nativeElement.textContent).toContain('Content');
    });
});
