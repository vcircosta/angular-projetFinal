import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
    selector: '[appHighlight]',
    standalone: true
})
export class HighlightDirective implements OnChanges {
    @Input() appHighlight: string = 'yellow';
    constructor(private el: ElementRef<HTMLElement>) { }

    ngOnChanges() {
        this.el.nativeElement.style.backgroundColor = this.appHighlight;
    }
}
