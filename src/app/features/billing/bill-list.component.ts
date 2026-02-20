import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-bill-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-header">
      <h1>Bills</h1>
    </div>
    <div class="card">
      <p>Billing feature under construction.</p>
    </div>
  `
})
export class BillListComponent { }
