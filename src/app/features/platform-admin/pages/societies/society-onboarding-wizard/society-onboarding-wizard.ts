import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformAdminService, Federation } from '../../../services/platform-admin.service';

@Component({
  selector: 'app-society-onboarding-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './society-onboarding-wizard.html',
  styleUrls: ['./society-onboarding-wizard.scss']
})
export class SocietyOnboardingWizard implements OnInit {
  private platformService = inject(PlatformAdminService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  currentStep = 1;
  totalSteps = 7;
  societyId: number | null = null;
  loading = false;
  error = '';
  success = '';

  federations: Federation[] = [];

  // Step 1: Basic Info
  step1Form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.pattern('^[A-Z0-9_]+$')]],
    requestedSubdomain: ['', Validators.required],
    federationId: [null],
    description: ['']
  });

  // Step 2: Address
  step2Form: FormGroup = this.fb.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
    pincode: ['', Validators.required]
  });

  // Step 3: Infrastructure
  step3Form: FormGroup = this.fb.group({
    totalBuildings: [0, Validators.min(0)],
    totalFlats: [0, Validators.min(0)],
    isTownship: [false],
    amenitiesInput: ['']
  });

  // Step 4: Legal & Registration
  step4Form: FormGroup = this.fb.group({
    registrationNumber: [''],
    registrationDate: [''],
    panNumber: [''],
    gstNumber: ['']
  });

  // Step 5: Supporting Documents
  documentFiles: { [key: string]: File } = {};
  uploadedDocuments: any[] = [];

  getDocumentName(type: string): string {
    const doc = this.uploadedDocuments?.find(d => d.documentType === type);
    return doc ? doc.fileName : '';
  }

  // Step 6: Branding
  step6Form: FormGroup = this.fb.group({
    primaryColor: ['#1976d2'],
    secondaryColor: ['#424242']
  });
  
  logoFile: File | null = null;
  bannerFile: File | null = null;

  // Step 7: Administrator
  step7Form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required]
  });

  ngOnInit() {
    this.platformService.getFederations(0, 100, 'ACTIVE').subscribe(res => {
      this.federations = res.content || [];
    });

    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.societyId = +params['id'];
        this.loadSocietyDetails(this.societyId);
      }
    });
  }

  loadSocietyDetails(id: number) {
    this.loading = true;
    this.platformService.getSociety(id).subscribe({
      next: (res: any) => {
        const society = res.data || res;
        
        this.platformService.getSocietyDocuments(id).subscribe({
          next: (docRes: any) => {
            this.uploadedDocuments = docRes.data || docRes;
          },
          error: () => {}
        });
        
        this.step1Form.patchValue({
          name: society.name,
          code: society.code,
          requestedSubdomain: society.subdomain,
          federationId: society.federationId,
          description: society.description
        });

        this.step2Form.patchValue({
          address: society.address,
          city: society.city,
          state: society.state,
          country: society.country,
          pincode: society.pincode
        });

        this.step3Form.patchValue({
          totalBuildings: society.totalBuildings,
          totalFlats: society.totalFlats,
          isTownship: society.isTownship,
          amenitiesInput: society.amenities ? society.amenities.join(', ') : ''
        });

        if (society.legalDetails) {
          let regDate = society.legalDetails.registrationDate;
          if (Array.isArray(regDate)) {
             regDate = `${regDate[0]}-${regDate[1].toString().padStart(2, '0')}-${regDate[2].toString().padStart(2, '0')}`;
          }
          this.step4Form.patchValue({
            registrationNumber: society.legalDetails.registrationNumber,
            registrationDate: regDate,
            panNumber: society.legalDetails.panNumber,
            gstNumber: society.legalDetails.gstNumber
          });
        }

        if (society.brandingDetails) {
          this.step6Form.patchValue({
            primaryColor: society.brandingDetails.primaryColor,
            secondaryColor: society.brandingDetails.secondaryColor,
            themePreference: society.brandingDetails.themePreference
          });
        }
        
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load society details.';
        this.loading = false;
      }
    });
  }

  nextStep() {
    this.error = '';
    this.success = '';

    if (this.currentStep === 1) {
      if (this.step1Form.invalid) {
        this.step1Form.markAllAsTouched();
        return;
      }
      this.loading = true;
      const data = this.step1Form.value;
      if (this.societyId) {
        data.id = this.societyId;
      }
      this.platformService.createSocietyDraft(data).subscribe({
        next: (res) => {
          try {
            console.log("createSocietyDraft response:", res);
            const id = res?.data?.id || res?.id;
            console.log("Extracted ID:", id);
            
            if (id) {
              this.societyId = id;
              this.currentStep++;
              console.log("Moved to step:", this.currentStep);
            } else {
              this.error = 'Failed to extract society ID from response.';
              console.error('Invalid response format:', res);
            }
          } catch (e) {
            console.error("Error in next block:", e);
            this.error = 'An unexpected error occurred.';
          } finally {
            this.loading = false;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error("API Error in nextStep:", err);
          this.error = err.error?.message || err.message || 'Failed to save draft.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (this.currentStep === 2) {
      if (this.step2Form.invalid) {
        this.step2Form.markAllAsTouched();
        return;
      }
      this.loading = true;
      const data = {
        id: this.societyId,
        ...this.step1Form.value,
        ...this.step2Form.value
      };
      this.platformService.createSocietyDraft(data).subscribe({
        next: () => {
          this.currentStep++;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("API Error in nextStep (Step 2):", err);
          this.error = err.error?.message || 'Failed to save address details.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (this.currentStep === 3) {
      if (this.step3Form.invalid) {
        this.step3Form.markAllAsTouched();
        return;
      }
      this.loading = true;
      const data = {
        id: this.societyId,
        ...this.step1Form.value,
        ...this.step2Form.value,
        ...this.step3Form.value,
        amenities: this.step3Form.value.amenitiesInput ? this.step3Form.value.amenitiesInput.split(',').map((s: string) => s.trim()) : []
      };
      this.platformService.createSocietyDraft(data).subscribe({
        next: () => {
          this.currentStep++;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("API Error in nextStep (Step 3):", err);
          this.error = err.error?.message || 'Failed to save infrastructure details.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (this.currentStep === 4) {
      if (this.step4Form.invalid) {
        this.step4Form.markAllAsTouched();
        return;
      }
      this.loading = true;
      const payload = {
        societyId: this.societyId,
        ...this.step4Form.value
      };

      this.platformService.updateSocietyLegal(payload).subscribe({
        next: () => {
          this.currentStep++;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("API Error in nextStep (Step 4):", err);
          this.error = err.error?.message || err.message || 'Failed to update legal details.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (this.currentStep === 5) {
      this.loading = true;
      this.uploadDocumentsSequential(Object.keys(this.documentFiles), 0);
    } else if (this.currentStep === 6) {
      this.loading = true;
      const data = this.step6Form.value;
      this.platformService.updateSocietyBranding(this.societyId!, data, this.logoFile, this.bannerFile).subscribe({
        next: () => {
          this.currentStep++;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update branding.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  private uploadDocumentsSequential(types: string[], index: number) {
    if (index >= types.length) {
      this.currentStep++;
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    const type = types[index];
    const file = this.documentFiles[type];
    
    this.platformService.uploadSocietyDocument(this.societyId!, type, file).subscribe({
      next: () => {
        this.uploadDocumentsSequential(types, index + 1);
      },
      error: (err) => {
        this.error = err.error?.message || `Failed to upload ${type} document.`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitOnboarding() {
    if (this.step7Form.invalid) {
      this.step7Form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const adminData = {
      societyId: this.societyId,
      ...this.step7Form.value
    };

    this.platformService.assignSocietyAdminStep(adminData).subscribe({
      next: () => {
        this.platformService.submitSocietyOnboarding({ societyId: this.societyId! }).subscribe({
          next: () => {
            this.loading = false;
            this.cdr.detectChanges();
            this.router.navigate(['/platform/societies'], { queryParams: { success: 'true' } });
          },
          error: (err) => {
            this.error = err.error?.message || 'Failed to submit society onboarding.';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to assign administrator.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onDocumentSelected(event: Event, type: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.documentFiles[type] = input.files[0];
    }
  }

  onImageSelected(event: any, type: 'logo' | 'banner') {
    const file = event.target.files[0];
    if (file) {
      if (type === 'logo') {
        this.step6Form.patchValue({ logo: file });
      } else {
        this.step6Form.patchValue({ banner: file });
      }
    }
  }

  onCodeInput(event: any) {
    let value = event.target.value;
    value = value.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
    this.step1Form.patchValue({ code: value });
  }

  cancel() {
    this.router.navigate(['/platform/societies']);
  }
}
