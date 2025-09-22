import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { errorInterceptor } from './error.interceptor';
import { ErrorService } from '../../../shared/services/error.services';

describe('errorInterceptor', () => {
    let errorService: jasmine.SpyObj<ErrorService>;

    beforeEach(() => {
        const errorSpy = jasmine.createSpyObj('ErrorService', ['showError']);

        TestBed.configureTestingModule({
            providers: [
                { provide: ErrorService, useValue: errorSpy },
            ],
        });

        errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    });

    function runInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
        return TestBed.runInInjectionContext(() =>
            errorInterceptor(request, next)
        );
    }

    it('✅ doit laisser passer la requête sans erreur', (done) => {
        const req = new HttpRequest('GET', '/api/test');
        const next: HttpHandlerFn = (request) => {
            expect(request).toBe(req);
            return of({} as HttpEvent<any>);
        };

        runInterceptor(req, next).subscribe({
            next: () => {
                expect(errorService.showError).not.toHaveBeenCalled();
                done();
            },
            error: () => fail('Ne doit pas générer d’erreur'),
        });
    });

    it('🚨 doit intercepter une erreur et appeler ErrorService', (done) => {
        const req = new HttpRequest('GET', '/api/test');
        const fakeError = { message: 'Erreur serveur' };

        const next: HttpHandlerFn = () => throwError(() => fakeError);

        runInterceptor(req, next).subscribe({
            next: () => fail('Doit relancer une erreur'),
            error: (err) => {
                expect(err).toBe(fakeError);
                expect(errorService.showError).toHaveBeenCalledWith('Erreur serveur');
                done();
            },
        });
    });

    it('🛑 doit afficher "Erreur réseau" si pas de message dans l’erreur', (done) => {
        const req = new HttpRequest('GET', '/api/test');
        const fakeError = {};

        const next: HttpHandlerFn = () => throwError(() => fakeError);

        runInterceptor(req, next).subscribe({
            next: () => fail('Doit relancer une erreur'),
            error: () => {
                expect(errorService.showError).toHaveBeenCalledWith('Erreur réseau');
                done();
            },
        });
    });
});
