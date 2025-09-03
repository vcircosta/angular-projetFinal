import { Routes } from '@angular/router';
import { ReservationListComponent } from './reservation-list.component';
import { ReservationFormComponent } from './reservation-form.component';
import { ReservationDetailComponent } from './reservation-detail.component';

export const RESERVATIONS_ROUTES: Routes = [
  { path: '', component: ReservationListComponent },
  { path: 'new', component: ReservationFormComponent },
  { path: ':id', component: ReservationDetailComponent }
];
