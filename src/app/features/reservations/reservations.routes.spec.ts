import { RESERVATIONS_ROUTES } from './reservations.routes';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { ReservationDetailComponent } from './reservation-detail/reservation-detail.component';

describe('RESERVATIONS_ROUTES', () => {
    it('✅ devrait contenir la route de la liste', () => {
        const route = RESERVATIONS_ROUTES.find(r => r.path === '');
        expect(route).toBeTruthy();
        expect(route!.component).toBe(ReservationListComponent);
    });

    it('✅ devrait contenir la route de création', () => {
        const route = RESERVATIONS_ROUTES.find(r => r.path === 'new');
        expect(route).toBeTruthy();
        expect(route!.component).toBe(ReservationFormComponent);
    });

    it('✅ devrait contenir la route du détail', () => {
        const route = RESERVATIONS_ROUTES.find(r => r.path === ':id');
        expect(route).toBeTruthy();
        expect(route!.component).toBe(ReservationDetailComponent);
    });

    it('✅ ne devrait pas avoir de routes inconnues', () => {
        const paths = RESERVATIONS_ROUTES.map(r => r.path);
        expect(paths).toEqual(['', 'new', ':id']);
    });
});
