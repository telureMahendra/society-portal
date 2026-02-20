import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-event-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-header">
      <h1>Events</h1>
    </div>
    <div class="card">
      <p>Events feature under construction.</p>
    </div>
  `
})
export class EventListComponent { }
