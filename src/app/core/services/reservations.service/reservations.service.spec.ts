import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReservationsService } from './reservations.service';
import { ErrorService } from '../../../shared/services/error.services';

describe('ReservationsService', () => {
    let service: ReservationsService;
    let errorService: ErrorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ReservationsService, ErrorService]
        });

        service = TestBed.inject(ReservationsService);
        errorService = TestBed.inject(ErrorService);

        localStorage.clear();
    });

    it('devrait charger les réservations par défaut si localStorage est vide', () => {
        service.loadReservations();
        const reservations = service.reservations();
        expect(reservations.length).toBeGreaterThan(0);
        expect(reservations[0].computerName).toBeDefined();
    });

    it('devrait ajouter une nouvelle réservation', fakeAsync(() => {
        service.loadReservations();

        const newRes = {
            computerId: 103,
            computerName: 'PC-103',
            userId: 1,
            date: '2025-09-06',
            duration: 2,
            location: 'Room C'
        };

        let addedRes: any;
        service.addReservation(newRes).subscribe(res => addedRes = res);

        tick(300); // avance le temps pour simuler le delay
        const allReservations = service.reservations();

        expect(addedRes).toBeDefined();
        expect(addedRes.id).toBeDefined();
        expect(allReservations.some(r => r.id === addedRes.id)).toBeTrue();
    }));

    it('devrait supprimer une réservation existante', fakeAsync(() => {
        service.loadReservations();
        const firstId = service.reservations()[0].id;

        let deleted = false;
        service.deleteReservation(firstId).subscribe(() => deleted = true);

        tick(300);
        expect(deleted).toBeTrue();
        expect(service.reservations().find(r => r.id === firstId)).toBeUndefined();
    }));

    it('devrait afficher une erreur si la réservation à supprimer n’existe pas', fakeAsync(() => {
        spyOn(errorService, 'showError');

        let error: any;
        service.deleteReservation(999).subscribe({
            next: () => { },
            error: (err) => error = err
        });

        tick(300);
        expect(error).toBeDefined();
        expect(error.message).toBe('Réservation non trouvée');
        expect(errorService.showError).toHaveBeenCalledWith('Réservation non trouvée');
    }));
});
