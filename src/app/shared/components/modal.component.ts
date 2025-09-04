import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [NgIf],
    template: `
    <div *ngIf="visible" class="modal-backdrop">
      <div class="modal-content">
        <ng-content></ng-content>
        <button (click)="close()">Close</button>
      </div>
    </div>
  `,
    styles: [`
    .modal-backdrop {
      position: fixed;
      top:0; left:0;
      width:100%; height:100%;
      background: rgba(0,0,0,0.5);
      display:flex; justify-content:center; align-items:center;
    }
    .modal-content {
      background:white; padding:1rem; border-radius:0.5rem;
    }
  `]
})
export class ModalComponent {
    @Input() visible: boolean = false;
    @Output() closed = new EventEmitter<void>();

    close() {
        this.closed.emit();
    }
}
