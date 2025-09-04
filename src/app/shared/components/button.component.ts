import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-button',
    standalone: true,
    template: `<button [type]="type" [disabled]="disabled" (click)="handleClick()">{{ label }}</button>`,
    styles: [`
    button {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      border: none;
      background-color: #1f2937; /* gris foncé */
      color: white;
      cursor: pointer;
    }
    button:disabled {
      background-color: #9ca3af; /* gris clair */
      cursor: not-allowed;
    }
  `]
})
export class ButtonComponent {
    @Input() label: string = 'Button';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() disabled: boolean = false;
    @Output() clicked = new EventEmitter<void>();

    handleClick() {
        this.clicked.emit();
    }
}
