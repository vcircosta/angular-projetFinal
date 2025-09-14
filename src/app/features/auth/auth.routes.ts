import { Routes } from '@angular/router';
import { LoginComponent } from './login.component/login.component';
import { RegisterComponent } from './register.component/register.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
