import { TestBed } from '@angular/core/testing';
import { ReservationFormComponent } from './reservation-form.component';
import { ReservationsService } from '../../../core/services/reservations.service/reservations.service';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('ReservationFormComponent', () => {
    let component: ReservationFormComponent;
    let reservationsServiceSpy: jasmine.SpyObj<ReservationsService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('ReservationsService', ['addReservation']);

        TestBed.configureTestingModule({
            imports: [ReservationFormComponent],
            providers: [
                FormBuilder,
                { provide: ReservationsService, useValue: spy }
            ]
        });

        component = TestBed.createComponent(ReservationFormComponent).componentInstance;
        reservationsServiceSpy = TestBed.inject(ReservationsService) as jasmine.SpyObj<ReservationsService>;
    });

    it('✅ devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('🚫 ne doit pas soumettre si le formulaire est invalide', () => {
        component.form.patchValue({ computerId: null, date: '', duration: 0 });
        component.onSubmit();
        expect(reservationsServiceSpy.addReservation).not.toHaveBeenCalled();
    });

    it('🚫 doit afficher une erreur si ordinateur invalide', () => {
        component.form.patchValue({ computerId: 9999, date: '2025-09-22', duration: 2 });
        component.onSubmit();
        expect(component.error()).toBe('Ordinateur invalide');
        expect(reservationsServiceSpy.addReservation).not.toHaveBeenCalled();
    });

    it('🚫 doit gérer les erreurs lors de addReservation', () => {
        reservationsServiceSpy.addReservation.and.returnValue(throwError(() => new Error('Erreur serveur')));

        component.form.patchValue({ computerId: 101, date: '2025-09-22', duration: 2 });
        component.onSubmit();

        expect(component.error()).toBe('Impossible d’enregistrer la réservation.');
        expect(component.isLoading()).toBeFalse();
    });
});
