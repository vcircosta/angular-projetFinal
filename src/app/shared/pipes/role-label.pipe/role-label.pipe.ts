import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roleLabel',
    standalone: true
})
export class RoleLabelPipe implements PipeTransform {
    transform(value: 'user' | 'admin'): string {
        switch (value) {
            case 'admin':
                return 'Administrateur';
            case 'user':
                return 'Utilisateur';
            default:
                return value;
        }
    }
}
