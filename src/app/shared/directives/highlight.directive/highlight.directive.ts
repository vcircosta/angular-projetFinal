import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';

@Directive({
    selector: '[appHighlight]',
    standalone: true
})
export class HighlightDirective implements OnChanges {
    @Input() appHighlight = 'yellow';
    private el = inject(ElementRef<HTMLElement>);

    ngOnChanges() {
        this.el.nativeElement.style.backgroundColor = this.appHighlight;
    }
}
