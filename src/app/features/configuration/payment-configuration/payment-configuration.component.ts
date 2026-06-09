import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaymentConfigurationService } from './payment-configuration.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-configuration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-configuration.component.html',
  styleUrls: ['./payment-configuration.component.scss']
})
export class PaymentConfigurationComponent implements OnInit {
  configForm: FormGroup;
  currentConfig: any = null;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'NOT CONFIGURED' = 'NOT CONFIGURED';

  // Track file uploads
  uploadingFiles: { [key: string]: boolean } = {
    panCardUrl: false,
    gstCertificateUrl: false,
    cancelledChequeUrl: false,
    merchantProofUrl: false
  };

  constructor(
    private fb: FormBuilder,
    private configService: PaymentConfigurationService,
    private http: HttpClient
  ) {
    this.configForm = this.fb.group({
      gatewayProvider: ['RAZORPAY', Validators.required],
      businessName: ['', Validators.required],
      legalEntityName: ['', Validators.required],
      panNumber: ['', Validators.required],
      gstNumber: [''],
      registeredMobileNumber: ['', Validators.required],
      registeredEmail: ['', [Validators.required, Validators.email]],
      keyId: ['', Validators.required],
      keySecret: [''],
      webhookSecret: [''],
      merchantAccountId: [''],
      accountHolderName: ['', Validators.required],
      bankName: ['', Validators.required],
      accountNumber: [''],
      ifscCode: ['', Validators.required],
      autoReceiptGeneration: [true],
      autoInvoiceGeneration: [true],
      refundAllowed: [false],
      partialPaymentAllowed: [false],
      
      // Document URLs
      panCardUrl: ['', Validators.required],
      gstCertificateUrl: [''],
      cancelledChequeUrl: ['', Validators.required],
      merchantProofUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig() {
    this.configService.getConfigDetails().subscribe({
      next: (config) => {
        if (config) {
          this.currentConfig = config;
          this.status = config.status;
          this.configForm.patchValue(config);
          if (this.status === 'APPROVED' || this.status === 'UNDER_REVIEW') {
            this.configForm.disable();
          }
        }
      },
      error: (err) => console.error('Failed to load config', err)
    });
  }

  saveDraft() {
    if (this.configForm.invalid) return;
    
    const payload = { configuration: this.configForm.value };
    this.configService.createOrUpdateDraft(payload).subscribe({
      next: (res) => {
        alert('Draft Saved Successfully');
        this.loadConfig();
      },
      error: (err) => alert('Error saving draft')
    });
  }

  onFileSelected(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.uploadingFiles[controlName] = true;
      const formData = new FormData();
      formData.append('file', file);
      
      // Post to the newly created backend upload endpoint
      this.http.post<{url: string}>(`${environment.apiBaseUrl}/files/upload`, formData).subscribe({
        next: (response) => {
          this.configForm.patchValue({
            [controlName]: response.url
          });
          this.uploadingFiles[controlName] = false;
        },
        error: (err) => {
          console.error("File upload failed", err);
          alert("Failed to upload file. Please try again.");
          this.uploadingFiles[controlName] = false;
          event.target.value = ''; // clear input
        }
      });
    }
  }

  submitForApproval() {
    if (this.configForm.invalid) {
      alert("Please fill all required fields before submitting.");
      return;
    }
    
    // Check if any files are currently uploading
    const isUploading = Object.values(this.uploadingFiles).some(val => val === true);
    if (isUploading) {
      alert("Please wait for all files to finish uploading before submitting.");
      return;
    }
    
    const formValue = this.configForm.value;
    
    const payload = {
      configuration: {
        ...formValue,
        // Exclude document URLs from the core configuration DTO
        panCardUrl: undefined,
        gstCertificateUrl: undefined,
        cancelledChequeUrl: undefined,
        merchantProofUrl: undefined
      },
      panCardUrl: formValue.panCardUrl,
      gstCertificateUrl: formValue.gstCertificateUrl,
      cancelledChequeUrl: formValue.cancelledChequeUrl,
      merchantProofUrl: formValue.merchantProofUrl
    };

    this.configService.submitForApproval(payload).subscribe({
      next: (res) => {
        alert('Submitted for Approval');
        this.loadConfig();
      },
      error: (err) => alert('Error submitting for approval')
    });
  }
}
