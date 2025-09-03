angular-projetFinal/
│
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── admin.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── http-error.interceptor.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── reservation.service.ts
│   │   │   │   └── signal.service.ts
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       └── reservation.model.ts
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   └── login.component.html
│   │   │   │   └── register/
│   │   │   │       ├── register.component.ts
│   │   │   │       └── register.component.html
│   │   │   │
│   │   │   ├── reservations/
│   │   │   │   ├── list/
│   │   │   │   │   ├── reservation-list.component.ts
│   │   │   │   │   └── reservation-list.component.html
│   │   │   │   ├── create/
│   │   │   │   │   ├── reservation-create.component.ts
│   │   │   │   │   └── reservation-create.component.html
│   │   │   │   └── edit/
│   │   │   │       ├── reservation-edit.component.ts
│   │   │   │       └── reservation-edit.component.html
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── user-management/
│   │   │       │   ├── user-list.component.ts
│   │   │       │   └── user-edit.component.ts
│   │   │       └── reservation-management/
│   │   │           ├── reservation-admin-list.component.ts
│   │   │           └── reservation-admin-edit.component.ts
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── navbar/
│   │   │   │   │   └── navbar.component.ts
│   │   │   │   ├── loader/
│   │   │   │   │   └── loader.component.ts
│   │   │   │   └── modal/
│   │   │   │       └── modal.component.ts
│   │   │   ├── directives/
│   │   │   │   └── highlight.directive.ts
│   │   │   └── pipes/
│   │   │       ├── date-format.pipe.ts
│   │   │       └── capitalize.pipe.ts
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   │
│   ├── assets/
│   └── styles/
│
├── angular.json
├── package.json
└── README.md
