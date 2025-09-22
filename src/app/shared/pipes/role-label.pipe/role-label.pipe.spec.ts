import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleLabelPipe } from './role-label.pipe';
import { By } from '@angular/platform-browser';

@Component({
    template: `<p>{{ role | roleLabel }}</p>`,
    standalone: true,
    imports: [RoleLabelPipe]
})
class TestHostComponent {
    role: 'user' | 'admin' = 'user';
}

describe('RoleLabelPipe', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent]
        });

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('devrait transformer "user" en "Utilisateur"', () => {
        component.role = 'user';
        fixture.detectChanges();

        const pEl = fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;
        expect(pEl.textContent).toBe('Utilisateur');
    });

    it('devrait transformer "admin" en "Administrateur"', () => {
        component.role = 'admin';
        fixture.detectChanges();

        const pEl = fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;
        expect(pEl.textContent).toBe('Administrateur');
    });

    it('devrait renvoyer la valeur originale si non reconnue', () => {
        // @ts-expect-error: test valeur inattendue
        component.role = 'guest';
        fixture.detectChanges();

        const pEl = fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;
        expect(pEl.textContent).toBe('guest');
    });
});
