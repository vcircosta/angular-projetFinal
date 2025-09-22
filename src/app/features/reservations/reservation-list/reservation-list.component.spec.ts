import { TestBed } from '@angular/core/testing';
import { ReservationListComponent } from './reservation-list.component';
import { ReservationsService } from '../../../core/services/reservations.service/reservations.service';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { Reservation } from '../../../core/models/reservation.model';

describe('ReservationListComponent', () => {
    let component: ReservationListComponent;
    let reservationsServiceSpy: jasmine.SpyObj<ReservationsService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('ReservationsService', ['loadReservations', 'addReservation', 'deleteReservation', 'reservations']);

        TestBed.configureTestingModule({
            imports: [ReservationListComponent],
            providers: [
                FormBuilder,
                { provide: ReservationsService, useValue: spy }
            ]
        });

        component = TestBed.createComponent(ReservationListComponent).componentInstance;
        reservationsServiceSpy = TestBed.inject(ReservationsService) as jasmine.SpyObj<ReservationsService>;

        // Simuler des réservations initiales
        reservationsServiceSpy.reservations.and.returnValue([]);
    });

    it('✅ devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('✅ devrait appeler loadReservations au démarrage', () => {
        component.ngOnInit();
        expect(reservationsServiceSpy.loadReservations).toHaveBeenCalled();
    });

    it('🚫 ne doit pas ajouter une réservation si le formulaire est invalide', () => {
        component.form.patchValue({ computerId: '', location: '', date: '', duration: 0 });
        component.addReservation();
        expect(reservationsServiceSpy.addReservation).not.toHaveBeenCalled();
    });
});
