import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-notice-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-header">
      <h1>Notices</h1>
    </div>
    <div class="card">
      <p>Notices feature under construction.</p>
    </div>
  `
})
export class NoticeListComponent { }
