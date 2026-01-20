import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
    let pipe: DateFormatPipe;

    beforeEach(() => {
        pipe = new DateFormatPipe();
    });

    it('✅ devrait créer le pipe', () => {
        expect(pipe).toBeTruthy();
    });

    it('✅ devrait transformer une date string en format français', () => {
        const dateStr = '2025-09-22';
        const result = pipe.transform(dateStr);
        expect(result).toBe(new Date(dateStr).toLocaleDateString('fr-FR'));
    });

    it('✅ devrait transformer un objet Date en format français', () => {
        const dateObj = new Date(2025, 8, 22);
        const result = pipe.transform(dateObj);
        expect(result).toBe(dateObj.toLocaleDateString('fr-FR'));
    });
});
