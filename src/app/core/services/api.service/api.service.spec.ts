import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
    let service: ApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiService],
        });

        service = TestBed.inject(ApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify(); // Vérifie qu’aucune requête en attente
    });

    it('✅ doit faire un GET avec paramètres', () => {
        const mockData = { id: 1, name: 'Test' };

        service.get('/items', { page: 1 }).subscribe((data) => {
            expect(data).toEqual(mockData);
        });

        const req = httpMock.expectOne('/api/items?page=1');
        expect(req.request.method).toBe('GET');
        req.flush(mockData);
    });

    it('📩 doit faire un POST', () => {
        const mockData = { success: true };
        const body = { name: 'New Item' };

        service.post('/items', body).subscribe((data) => {
            expect(data).toEqual(mockData);
        });

        const req = httpMock.expectOne('/api/items');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(body);
        req.flush(mockData);
    });

    it('✏️ doit faire un PUT', () => {
        const mockData = { success: true };
        const body = { name: 'Updated Item' };

        service.put('/items/1', body).subscribe((data) => {
            expect(data).toEqual(mockData);
        });

        const req = httpMock.expectOne('/api/items/1');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(body);
        req.flush(mockData);
    });

    it('🗑️ doit faire un DELETE', () => {
        const mockData = { success: true };

        service.delete('/items/1').subscribe((data) => {
            expect(data).toEqual(mockData);
        });

        const req = httpMock.expectOne('/api/items/1');
        expect(req.request.method).toBe('DELETE');
        req.flush(mockData);
    });
});
