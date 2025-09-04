import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFormat',
    standalone: true
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string | Date, format: string = 'shortDate'): string {
        if (!value) return '';
        const date = typeof value === 'string' ? new Date(value) : value;
        return date.toLocaleDateString('fr-FR');
    }
}
