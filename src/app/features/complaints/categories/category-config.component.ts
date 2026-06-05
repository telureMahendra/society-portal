import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplaintCategoryService, ComplaintCategory } from '../../../core/services/complaint-category.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-category-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-config.component.html',
  styleUrls: ['./category-config.component.scss']
})
export class CategoryConfigComponent implements OnInit {
  categories: ComplaintCategory[] = [];
  isLoading = false;
  
  searchTerm = '';
  currentStatus: boolean | null = null;
  
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;
  
  showModal = false;
  isEditMode = false;
  categoryForm: FormGroup;
  selectedCategory: ComplaintCategory | null = null;
  submitError = '';

  private searchSubject = new Subject<string>();

  constructor(
    private categoryService: ComplaintCategoryService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      displayOrder: [0, Validators.required],
      active: [true]
    });
  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 1;
      this.loadCategories();
    });

    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    const req: any = {
      page: this.currentPage,
      size: this.pageSize,
      search: this.searchTerm
    };
    if (this.currentStatus !== null) {
      req.active = this.currentStatus;
    }

    this.categoryService.listCategories(req).subscribe({
      next: (res: any) => {
        if (res && res.status === '00' && res.data) {
          this.categories = res.data.content || [];
          this.totalPages = res.data.totalPages || 0;
          this.totalElements = res.data.totalElements || this.categories.length;
        } else {
          this.categories = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  setStatusFilter(status: boolean | null) {
    this.currentStatus = status;
    this.currentPage = 1;
    this.loadCategories();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadCategories();
    }
  }

  openAddModal() {
    this.isEditMode = false;
    this.selectedCategory = null;
    this.submitError = '';
    this.categoryForm.reset({ active: true, displayOrder: 0 });
    this.showModal = true;
  }

  openEditModal(category: ComplaintCategory) {
    this.isEditMode = true;
    this.selectedCategory = category;
    this.submitError = '';
    this.categoryForm.patchValue({
      categoryName: category.categoryName,
      description: category.description,
      displayOrder: category.displayOrder,
      active: category.active
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const formVal = this.categoryForm.value;
    
    if (this.isEditMode && this.selectedCategory) {
      const req = {
        categoryId: this.selectedCategory.id,
        categoryName: formVal.categoryName,
        description: formVal.description,
        displayOrder: formVal.displayOrder
      };
      this.categoryService.updateCategory(req).subscribe({
        next: (res: any) => {
          if (res.status === '00') {
            if (this.selectedCategory!.active !== formVal.active) {
              this.categoryService.changeStatus(this.selectedCategory!.id, formVal.active).subscribe(() => this.loadCategories());
            } else {
              this.loadCategories();
            }
            this.closeModal();
          } else {
            this.submitError = res.message || 'Failed to update category';
          }
        },
        error: (err: any) => this.submitError = 'Failed to update category'
      });
    } else {
      const req = {
        categoryName: formVal.categoryName,
        description: formVal.description,
        displayOrder: formVal.displayOrder
      };
      this.categoryService.addCategory(req).subscribe({
        next: (res: any) => {
          if (res.status === '00') {
            this.loadCategories();
            this.closeModal();
          } else {
            this.submitError = res.message || 'Failed to add category';
          }
        },
        error: (err: any) => this.submitError = 'Failed to add category'
      });
    }
  }

  toggleStatus(category: ComplaintCategory) {
    if (confirm(`Are you sure you want to ${category.active ? 'deactivate' : 'activate'} this category?`)) {
      this.categoryService.changeStatus(category.id, !category.active).subscribe({
        next: (res: any) => {
          if (res.status === '00') {
            this.loadCategories();
          } else {
            alert(res.message);
          }
        }
      });
    }
  }

  deleteCategory(category: ComplaintCategory) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (res: any) => {
          if (res.status === '00') {
            this.loadCategories();
          } else {
            alert(res.message);
          }
        }
      });
    }
  }
}
