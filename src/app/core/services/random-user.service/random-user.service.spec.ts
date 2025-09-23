import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RandomUserService } from './random-user.service';

describe('RandomUserService', () => {
    let service: RandomUserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RandomUserService]
        });

        service = TestBed.inject(RandomUserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('✅ devrait créer le service', () => {
        expect(service).toBeTruthy();
    });

});
