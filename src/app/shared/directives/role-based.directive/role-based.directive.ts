import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service/auth.service';
import { User } from '../../../core/models/user.model';

@Directive({
    selector: '[appRole]',
    standalone: true
})
export class RoleBasedDirective {
    private readonly authService = inject(AuthService);
    private readonly templateRef = inject(TemplateRef<unknown>);
    private readonly viewContainer = inject(ViewContainerRef);

    @Input('appRole') allowedRoles!: ('user' | 'admin') | ('user' | 'admin')[];

    constructor() {
        effect(() => {
            const user = this.authService.currentUser();
            this.updateView(user);
        });
    }

    private updateView(user: User | null) {
        this.viewContainer.clear();

        if (!user) return;

        const roles = Array.isArray(this.allowedRoles)
            ? this.allowedRoles
            : [this.allowedRoles];

        if (roles.includes(user.role)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
