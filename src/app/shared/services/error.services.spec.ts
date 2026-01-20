import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.services';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ErrorService', () => {
    let service: ErrorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ErrorService]
        });
        service = TestBed.inject(ErrorService);
    });

    it('✅ devrait créer le service', () => {
        expect(service).toBeTruthy();
    });

    it('✅ should add an error and remove it after 5s', fakeAsync(() => {
        service.showError('Test error');
        let errors = service.errors$();
        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe('Test error');
        expect(errors[0].type).toBe('error');

        tick(5000);
        errors = service.errors$();
        expect(errors.length).toBe(0);
    }));

    it('✅ should add a warning and remove it after 3s', fakeAsync(() => {
        service.showWarning('Test warning');
        let errors = service.errors$();
        expect(errors.length).toBe(1);
        expect(errors[0].type).toBe('warning');

        tick(3000);
        errors = service.errors$();
        expect(errors.length).toBe(0);
    }));

    it('✅ should add an info and remove it after 2s', fakeAsync(() => {
        service.showInfo('Test info');
        let errors = service.errors$();
        expect(errors.length).toBe(1);
        expect(errors[0].type).toBe('info');

        tick(2000);
        errors = service.errors$();
        expect(errors.length).toBe(0);
    }));

    it('✅ should remove error manually', () => {
        service.showError('Remove me');
        const id = service.errors$()[0].id;
        service.removeError(id);
        expect(service.errors$().length).toBe(0);
    });

    it('✅ should clear all errors', () => {
        service.showError('Error 1');
        service.showWarning('Warning 1');
        expect(service.errors$().length).toBe(2);
        service.clearAll();
        expect(service.errors$().length).toBe(0);
    });

    it('✅ should handle HTTP errors', fakeAsync(() => {
        service.handleHttpError(400);
        expect(service.errors$()[0].message).toBe('Requête invalide');

        service.handleHttpError(401);
        expect(service.errors$()[1].message).toBe('Session expirée. Veuillez vous reconnecter.');

        service.handleHttpError(403);
        expect(service.errors$()[2].message).toBe('Accès refusé. Vous n\'avez pas les permissions nécessaires.');

        service.handleHttpError(404);
        expect(service.errors$()[3].message).toBe('Ressource non trouvée');

        service.handleHttpError(500);
        expect(service.errors$()[4].message).toBe('Erreur serveur. Veuillez réessayer plus tard.');

        // test avec message fourni
        service.handleHttpError(999, 'Custom error');
        expect(service.errors$()[5].message).toBe('Custom error');

        // test fallback sans message
        service.handleHttpError(999);
        expect(service.errors$()[6].message).toBe('Erreur 999: Une erreur inattendue s\'est produite.');

        tick(5000);
        expect(service.errors$().length).toBe(0);
    }));
});
