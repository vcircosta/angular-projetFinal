import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
    selector: '[appRole]',
    standalone: true
})
export class RoleBasedDirective {
    private authService = inject(AuthService);

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    @Input() set appRole(role: 'user' | 'admin') {
        const currentUser = this.authService.getCurrentUser();
        this.viewContainer.clear();
        if (currentUser?.role === role) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
