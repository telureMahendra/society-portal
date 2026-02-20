import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Toast } from '../../../core/services/notification.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of notificationService.toasts()" 
        class="toast" 
        [ngClass]="toast.type"
        (click)="notificationService.remove(toast.id)"
      >
        <div class="toast-content">
          <i class="fas" [ngClass]="getIcon(toast.type)"></i>
          <span>{{ toast.message }}</span>
        </div>
        <button class="close-btn">&times;</button>
      </div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      min-width: 300px;
      padding: 1rem;
      border-radius: 0.5rem;
      color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      transition: all 0.2s;
    }

    .toast:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.25rem;
      cursor: pointer;
      opacity: 0.8;
      padding: 0 0 0 1rem;
    }

    .close-btn:hover {
      opacity: 1;
    }

    /* Types */
    .toast.success { background-color: #10b981; }
    .toast.error { background-color: #ef4444; }
    .toast.warning { background-color: #f59e0b; }
    .toast.info { background-color: #3b82f6; }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
    notificationService = inject(NotificationService);

    getIcon(type: Toast['type']): string {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info': return 'fa-info-circle';
        }
    }
}
