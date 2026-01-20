import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { By } from '@angular/platform-browser';

describe('LoadingSpinnerComponent', () => {
    let component: LoadingSpinnerComponent;
    let fixture: ComponentFixture<LoadingSpinnerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadingSpinnerComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingSpinnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('✅ devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('✅ devrait avoir loading par défaut à true', () => {
        expect(component.loading).toBeTrue();
    });

    it('✅ devrait refléter le changement de loading dans le DOM', () => {
        let spinnerElement = fixture.debugElement.query(By.css('.spinner'));
        expect(spinnerElement).toBeTruthy();

        component.loading = false;
        fixture.detectChanges();

        spinnerElement = fixture.debugElement.query(By.css('.spinner'));
        expect(spinnerElement).toBeNull();
    });
});
