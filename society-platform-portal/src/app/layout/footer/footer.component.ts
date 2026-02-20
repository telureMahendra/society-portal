import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <p>&copy; 2026 Society Platform. All rights reserved.</p>
    </footer>
  `,
  styles: [`
    .app-footer {
      padding: 1rem;
      text-align: center;
      background-color: #f8f9fa;
      border-top: 1px solid #ddd;
      font-size: 0.875rem;
      color: #666;
    }
  `]
})
export class FooterComponent { }
