import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
    >
      {{ label }}
    </button>
  `,
  styles: [`
    button {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      border: none;
      background-color: #1f2937; /* gris foncé */
      color: white;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    button:hover:not(:disabled) {
      background-color: #374151; /* gris un peu plus clair */
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
}
