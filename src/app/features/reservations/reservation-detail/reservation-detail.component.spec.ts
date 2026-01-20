import { TestBed } from '@angular/core/testing';
import { ReservationDetailComponent } from './reservation-detail.component';
import { ReservationsService } from '../../../core/services/reservations.service/reservations.service';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';

describe('ReservationDetailComponent', () => {
    let component: ReservationDetailComponent;
    let reservationsServiceSpy: jasmine.SpyObj<ReservationsService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('ReservationsService', ['loadReservation', 'selectedReservation']);
        spy.selectedReservation.and.returnValue(signal({ id: 1, name: 'Test Reservation' }));

        TestBed.configureTestingModule({
            imports: [ReservationDetailComponent],
            providers: [
                { provide: ReservationsService, useValue: spy },
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
            ]
        });

        component = TestBed.createComponent(ReservationDetailComponent).componentInstance;
        reservationsServiceSpy = TestBed.inject(ReservationsService) as jasmine.SpyObj<ReservationsService>;
    });

    it('✅ devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('✅ ngOnInit doit appeler loadReservation avec l\'ID de la route', () => {
        component.ngOnInit();
        expect(reservationsServiceSpy.loadReservation).toHaveBeenCalledWith(1);
    });

});
