import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    imports: [NgIf],
    template: `
    <div *ngIf="loading" class="spinner"></div>
  `,
    styles: [`
    .spinner {
      border: 4px solid rgba(0,0,0,0.1);
      border-top-color: #1f2937;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
    @Input() loading: boolean = true;
}
