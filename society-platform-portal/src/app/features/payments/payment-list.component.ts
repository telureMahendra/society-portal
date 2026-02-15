import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-payment-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-header">
      <h1>Payments</h1>
    </div>
    <div class="card">
      <p>Payments feature under construction.</p>
    </div>
  `
})
export class PaymentListComponent { }
