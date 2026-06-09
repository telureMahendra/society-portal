import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { BillingService } from '../services/billing.service';
import { BillingRecord } from '../models/billing.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-billing-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="invoice-page-container">
      <div class="page-header">
        <button class="back-btn" routerLink="/billing/history">
          <i class="fas fa-arrow-left"></i> Back to Bills
        </button>
        <div class="actions">
          <button *ngIf="bill && bill.status !== 'PAID'" class="btn-primary" (click)="markPaid()">
            <i class="fas fa-check"></i> Mark Paid
          </button>
          <button class="btn-outline" (click)="downloadPDF()" [disabled]="downloading">
            <i class="fas" [ngClass]="downloading ? 'fa-spinner fa-spin' : 'fa-download'"></i> 
            {{ downloading ? 'Generating PDF...' : 'Download Invoice' }}
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading invoice details...</p>
      </div>

      <div class="invoice-card" #invoiceContent *ngIf="!loading && bill">
        
        <!-- Invoice Header -->
        <div class="invoice-header">
          <div class="society-info">
            <h2>Gokuldham Society</h2>
            <p>123 Main Street, Goregaon East</p>
            <p>Mumbai, MH 400063</p>
          </div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <div class="status-badge" [ngClass]="bill.status.toLowerCase()">
              {{ bill.status }}
            </div>
          </div>
        </div>

        <div class="invoice-divider"></div>

        <!-- Meta Info -->
        <div class="invoice-meta">
          <div class="meta-section">
            <span class="meta-label">Billed To:</span>
            <strong>{{ bill.ownerName || 'Owner / Tenant' }}</strong>
            <p>Unit Details: {{ bill.flatDisplay || getFlatDisplay(bill.unitId) }}</p>
            <p>Society Reg No: {{ bill.societyRegNo || bill.societyId }}</p>
          </div>
          <div class="meta-section right">
            <div class="meta-row">
              <span class="meta-label">Invoice Number:</span>
              <strong>{{ bill.invoiceNumber }}</strong>
            </div>
            <div class="meta-row">
              <span class="meta-label">Bill Date:</span>
              <span>{{ bill.billDate | date:'mediumDate' }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Due Date:</span>
              <span class="due-date">{{ bill.dueDate | date:'mediumDate' }}</span>
            </div>
          </div>
        </div>

        <!-- Line Items -->
        <div class="invoice-items">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="amount-col">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{{ bill.remarks || 'Monthly Maintenance Charge' }}</strong>
                  <p class="item-desc">Base billing amount</p>
                </td>
                <td class="amount-col">₹{{ bill.amount | number:'1.2-2' }}</td>
              </tr>
              <tr *ngIf="bill.penaltyAmount > 0">
                <td>
                  <strong>Late Payment Penalty</strong>
                  <p class="item-desc">Applied due to late payment</p>
                </td>
                <td class="amount-col">₹{{ bill.penaltyAmount | number:'1.2-2' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Payment Details -->
        <div class="invoice-items" *ngIf="bill.paymentMode && bill.paymentMode !== 'N/A'">
          <table>
            <thead>
              <tr>
                <th colspan="2">Payment Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Payment Method:</strong></td>
                <td class="amount-col">{{ bill.paymentMode }}</td>
              </tr>
              <tr>
                <td><strong>Transaction Reference:</strong></td>
                <td class="amount-col">{{ bill.transactionRef }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary -->
        <div class="invoice-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>₹{{ (bill.amount + bill.penaltyAmount) | number:'1.2-2' }}</span>
          </div>
          <div class="summary-row" *ngIf="bill.paidAmount > 0">
            <span>Amount Paid:</span>
            <span class="paid-val">- ₹{{ bill.paidAmount | number:'1.2-2' }}</span>
          </div>
          <div class="summary-row total">
            <span>Total Due:</span>
            <span>₹{{ (bill.totalAmount - bill.paidAmount) | number:'1.2-2' }}</span>
          </div>
        </div>

        <div class="invoice-footer">
          <p>Thank you for your timely payment!</p>
          <p class="small">If you have any questions regarding this invoice, please contact the society admin.</p>
          <p class="small" style="margin-top: 16px; font-weight: bold;">*** This is a computer generated invoice and requires no signature. ***</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invoice-page-container { padding: 24px; animation: fadeIn 0.4s ease-out; max-width: 900px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .back-btn { background: none; border: none; color: #64748b; font-size: 15px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 8px; transition: all 0.2s; }
    .back-btn:hover { background: #f1f5f9; color: #0f172a; }
    .actions { display: flex; gap: 12px; }
    .btn-primary { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .btn-primary:hover { background: #2563eb; }
    .btn-outline { background: white; color: #3b82f6; border: 1px solid #3b82f6; padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .btn-outline:hover { background: #eff6ff; }
    .btn-outline:disabled { opacity: 0.7; cursor: not-allowed; }
    .invoice-card { background: white; border-radius: 12px; padding: 48px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); color: #1e293b; }
    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
    .society-info h2 { margin: 0 0 8px 0; font-size: 24px; color: #0f172a; }
    .society-info p { margin: 0 0 4px 0; color: #64748b; font-size: 14px; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { margin: 0 0 12px 0; font-size: 36px; color: #cbd5e1; letter-spacing: 2px; }
    .invoice-divider { height: 1px; background: #e2e8f0; margin: 32px 0; }
    .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .meta-section { display: flex; flex-direction: column; gap: 6px; }
    .meta-section.right { align-items: flex-end; }
    .meta-label { color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .meta-section p { margin: 0; font-size: 14px; color: #475569; }
    .meta-row { display: flex; gap: 16px; justify-content: flex-end; width: 300px; font-size: 14px; }
    .meta-row .meta-label { margin-bottom: 0; width: 130px; text-align: right; }
    .due-date { font-weight: 600; color: #dc2626; }
    .invoice-items table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
    .invoice-items th { background: #f8fafc; padding: 12px 16px; text-align: left; font-weight: 600; color: #475569; border-bottom: 2px solid #e2e8f0; }
    .invoice-items td { padding: 16px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .amount-col { text-align: right !important; }
    .item-desc { margin: 4px 0 0 0; font-size: 13px; color: #64748b; }
    .invoice-summary { width: 300px; margin-left: auto; display: flex; flex-direction: column; gap: 12px; margin-bottom: 48px; }
    .summary-row { display: flex; justify-content: space-between; font-size: 15px; color: #475569; }
    .summary-row.total { font-size: 20px; font-weight: 700; color: #0f172a; border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 4px; }
    .paid-val { color: #16a34a; }
    .invoice-footer { text-align: center; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 24px; }
    .invoice-footer .small { font-size: 13px; color: #94a3b8; margin-top: 8px; }
    .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 1px; }
    .status-badge.pending { background: #fefce8; color: #ca8a04; border: 1px solid #fef08a; }
    .status-badge.paid { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
    .status-badge.partial { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
    .status-badge.overdue { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
    .loading-state { text-align: center; padding: 64px; color: #94a3b8; }
    .spinner { width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px auto; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class BillingDetailsComponent implements OnInit {
  
  @ViewChild('invoiceContent') invoiceContent!: ElementRef;
  
  bill: BillingRecord | null = null;
  loading = true;
  downloading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billingService: BillingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBill(Number(id));
    } else {
      this.router.navigate(['/billing/history']);
    }
  }

  loadBill(id: number): void {
    this.loading = true;
    this.billingService.getBillDetails(id).subscribe({
      next: (data) => {
        this.bill = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/billing/history']);
      }
    });
  }

  getFlatDisplay(unitId: number): string {
    return 'Flat ' + unitId; // Placeholder - would usually resolve via flat service
  }

  markPaid(): void {
    if (this.bill && confirm('Mark this invoice as Paid?')) {
      this.billingService.markPaid(this.bill.id).subscribe(() => {
        this.loadBill(this.bill!.id);
      });
    }
  }

  async downloadPDF() {
    if (!this.invoiceContent || !this.bill) return;
    this.downloading = true;
    
    try {
      const element = this.invoiceContent.nativeElement;
      const canvas = await html2canvas(element, { scale: 2 });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${this.bill.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Failed to generate PDF invoice.');
    } finally {
      this.downloading = false;
    }
  }
}
