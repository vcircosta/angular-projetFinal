import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
    let service: NotificationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NotificationService]
        });
        service = TestBed.inject(NotificationService);
    });

    it('✅ devrait créer le service', () => {
        expect(service).toBeTruthy();
    });

    it('✅ success() devrait appeler console.log avec le bon message', () => {
        const spyLog = spyOn(console, 'log');
        const message = 'Opération réussie';
        service.success(message);
        expect(spyLog).toHaveBeenCalledWith('[SUCCESS]', message);
    });

    it('✅ error() devrait appeler console.error avec le bon message', () => {
        const spyError = spyOn(console, 'error');
        const message = 'Erreur détectée';
        service.error(message);
        expect(spyError).toHaveBeenCalledWith('[ERROR]', message);
    });

    it('✅ info() devrait appeler console.info avec le bon message', () => {
        const spyInfo = spyOn(console, 'info');
        const message = 'Information importante';
        service.info(message);
        expect(spyInfo).toHaveBeenCalledWith('[INFO]', message);
    });
});
