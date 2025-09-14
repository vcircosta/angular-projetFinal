import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComputerManagementComponent } from './computer-management.component';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service/auth.service';
import { ReservationsService } from '../../../core/services/reservations.service/reservations.service';
import { By } from '@angular/platform-browser';
import { User } from '../../../core/models/user.model';
import { Reservation } from '../../../core/models/reservation.model';

describe('ComputerManagementComponent', () => {
    let component: ComputerManagementComponent;
    let fixture: ComponentFixture<ComputerManagementComponent>;
    let mockAuthService: Partial<AuthService>;
    let mockReservationsService: Partial<ReservationsService>;

    const mockUsers: User[] = [
        { id: 1, name: 'Alice', email: 'alice@test.com', role: 'user' },
        { id: 2, name: 'Bob', email: 'bob@test.com', role: 'admin' },
    ];

    const mockReservations: Reservation[] = [
        { id: 1, computerId: 101, userId: 1, date: '2025-09-04', duration: 2, location: 'Room A', computerName: 'PC-101' },
        { id: 2, computerId: 102, userId: 2, date: '2025-09-05', duration: 3, location: 'Room B', computerName: 'PC-102' },
        { id: 3, computerId: 102, userId: 1, date: '2025-09-14', duration: 1, location: 'Room A', computerName: 'PC-102' },
    ];

    beforeEach(async () => {
        mockAuthService = { getUsers: () => mockUsers };
        mockReservationsService = {
            loadReservations: () => { },
            reservations: signal([...mockReservations]), // ✅ signal avec le bon type
        };

        await TestBed.configureTestingModule({
            imports: [CommonModule, ComputerManagementComponent], // ✅ importer le composant
            providers: [{ provide: AuthService, useValue: mockAuthService },
            { provide: ReservationsService, useValue: mockReservationsService }]
        }).compileComponents();

        fixture = TestBed.createComponent(ComputerManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize reservations from service', () => {
        expect(component.reservations().length).toBe(3);
    });

    it('should display all used computers', () => {
        const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
        expect(rows.length).toBe(3);
    });

    it('should delete a single reservation', () => {
        component.deleteReservation(1);
        expect(component.reservations().length).toBe(2);
        expect(component.reservations().some(r => r.id === 1)).toBeFalse();
    });

    it('should delete all reservations for a computer', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        component.deleteAllReservations(102);
        expect(component.reservations().some(r => r.computerId === 102)).toBeFalse();
        expect(component.reservations().length).toBe(1);
    });

    it('should not delete all reservations if confirm is cancelled', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        component.deleteAllReservations(102);
        expect(component.reservations().some(r => r.computerId === 102)).toBeTrue();
    });

    it('getReservations should return reservations sorted by date', () => {
        const sorted = component.getReservations(102);
        expect(sorted[0].id).toBe(2);
        expect(sorted[1].id).toBe(3);
    });

    it('user names should be correctly mapped', () => {
        const res = component.getReservations(102);
        expect(res[0].user).toBe('Bob');
        expect(res[1].user).toBe('Alice');
    });
});
