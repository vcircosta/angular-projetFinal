import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service/auth.service';
import { User } from '../../../core/models/user.model';

@Directive({
    selector: '[appRole]',
    standalone: true
})
export class RoleBasedDirective {
    private authService = inject(AuthService);

    @Input('appRole') allowedRoles!: ('user' | 'admin') | Array<'user' | 'admin'>;

    constructor(
        private templateRef: TemplateRef<unknown>,
        private viewContainer: ViewContainerRef
    ) {
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
