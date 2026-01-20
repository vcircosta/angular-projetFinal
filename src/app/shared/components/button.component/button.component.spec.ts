import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { ComponentFixture } from '@angular/core/testing';

describe('ButtonComponent', () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ButtonComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('✅ devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('✅ devrait avoir les valeurs par défaut correctes', () => {
        expect(component.label).toBe('Button');
        expect(component.type).toBe('button');
        expect(component.disabled).toBeFalse();
    });

    it('✅ devrait accepter des inputs personnalisés', () => {
        component.label = 'Envoyer';
        component.type = 'submit';
        component.disabled = true;
        fixture.detectChanges();

        expect(component.label).toBe('Envoyer');
        expect(component.type).toBe('submit');
        expect(component.disabled).toBeTrue();
    });
});
