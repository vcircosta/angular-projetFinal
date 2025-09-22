import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
    let component: ModalComponent;
    let fixture: ComponentFixture<ModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('✅ devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('✅ devrait avoir visible par défaut à false', () => {
        expect(component.visible).toBeFalse();
    });

    it('✅ devrait cacher le modal si visible=false', () => {
        component.visible = false;
        fixture.detectChanges();

        const modalElement = fixture.debugElement.query(By.css('.modal'));
        expect(modalElement).toBeNull();
    });

    it('✅ devrait émettre l’événement closed quand close() est appelé', () => {
        spyOn(component.closed, 'emit');

        component.close();

        expect(component.closed.emit).toHaveBeenCalled();
    });
});
