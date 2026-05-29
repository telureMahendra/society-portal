import re

with open('src/app/features/units/society-units.component.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace search box binding
content = content.replace(
    '<input type="text" [(ngModel)]="searchTerm" placeholder="Search flat or owner...">',
    '<input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange($event)" placeholder="Search flat or owner...">'
)

# Replace filteredFlats with displayedFlats
content = content.replace(
    '<div *ngFor="let flat of filteredFlats" class="flat-card glass-card">',
    '<div *ngFor="let flat of displayedFlats" class="flat-card glass-card">'
)
content = content.replace(
    '<div *ngIf="filteredFlats.length === 0" class="empty-state">',
    '<div *ngIf="displayedFlats.length === 0" class="empty-state">'
)

pagination_html = '''
          <div class="pagination-controls glass-card" *ngIf="totalElements > 0">
            <div class="page-info">
              Showing {{ currentPage * pageSize + 1 }} to {{ min((currentPage + 1) * pageSize, totalElements) }} of {{ totalElements }} entries
            </div>
            <div class="page-actions">
              <select [(ngModel)]="pageSize" (change)="onPageSizeChange()">
                <option *ngFor="let size of pageSizes" [value]="size">{{ size }} / page</option>
              </select>
              <button class="btn btn-outline" [disabled]="currentPage === 0" (click)="onPageChange(currentPage - 1)"><i class="fas fa-chevron-left"></i></button>
              <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
              <button class="btn btn-outline" [disabled]="currentPage >= totalPages - 1" (click)="onPageChange(currentPage + 1)"><i class="fas fa-chevron-right"></i></button>
            </div>
          </div>
'''

content = content.replace(
    '<div *ngIf="displayedFlats.length === 0" class="empty-state">\n            <i class="fas fa-search"></i>\n            <p>No flats found matching your search.</p>\n          </div>',
    '<div *ngIf="displayedFlats.length === 0" class="empty-state">\n            <i class="fas fa-search"></i>\n            <p>No flats found matching your search.</p>\n          </div>' + pagination_html
)

# Add pagination styles
content = content.replace(
    '.flat-summary {',
    '.pagination-controls { display: flex; justify-content: space-between; align-items: center; padding: 1rem; margin-top: 1.5rem; border-radius: 0.75rem; }\n    .page-actions { display: flex; align-items: center; gap: 1rem; }\n    .page-actions select { padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; outline: none; }\n    .page-actions button { padding: 0.5rem 1rem; }\n    .flat-summary {'
)

# Update the Class Properties and Methods
class_body_search = r'(export class SocietyUnitsComponent implements OnInit \{\s*)(.*?)(\s*constructor)'
class_body_replacement = r'''\1
    wings: Wing[] = [];
    selectedWing: Wing | null = null;
    searchTerm: string = '';
    searchSubject = new Subject<string>();

    displayedFlats: Flat[] = [];
    currentPage = 0;
    pageSize = 10;
    totalElements = 0;
    totalPages = 0;
    pageSizes = [10, 20, 30, 50, 100];

    // Modal State
    showModal = false;
    editingFlat: Flat | null = null;
    ownerForm = {
        name: '',
        type: 'OWNER' as 'OWNER' | 'TENANT'
    };

    // Bulk Upload State
    showBulkModal = false;
    isUploading = false;
    uploadProgress = 0;
    uploadComplete = false;

    // Add Wing State
    showAddWingModal = false;
    newWingForm = {
        name: '',
        totalFloors: null as any,
        flatsPerFloor: null as any
    };

\3'''
content = re.sub(class_body_search, class_body_replacement, content, flags=re.DOTALL)

# Update ngOnInit and selectWing and add loadFlats logic
methods_search = r'(ngOnInit\(\): void \{)(.*?)(get filteredFlats\(\): Flat\[\] \{.*?\n      \})'
methods_replacement = r'''\1
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(() => {
            this.currentPage = 0;
            this.loadFlats();
        });

        this.structureService.getWings().subscribe(wings => {
            this.wings = wings;
            if (wings.length > 0) {
                this.selectWing(wings[0]);
            }
            this.cdr.detectChanges();
        });
    }

    selectWing(wing: Wing): void {
        this.selectedWing = wing;
        this.currentPage = 0;
        this.searchTerm = '';
        this.loadFlats();
    }

    loadFlats(): void {
        if (!this.selectedWing) return;
        this.structureService.getFlats(
            this.selectedWing.name,
            this.searchTerm,
            this.currentPage,
            this.pageSize
        ).subscribe((response: any) => {
            if (response && response.content) {
                this.displayedFlats = response.content;
                this.totalElements = response.totalElements;
                this.totalPages = response.totalPages;
                this.currentPage = response.pageNo;
                this.pageSize = response.pageSize;
            } else {
                // Fallback for when backend might return list directly (old mock behavior)
                this.displayedFlats = Array.isArray(response) ? response : [];
                this.totalElements = this.displayedFlats.length;
                this.totalPages = 1;
            }
            this.cdr.detectChanges();
        });
    }

    min(a: number, b: number): number {
        return Math.min(a, b);
    }

    onSearchChange(value: string): void {
        this.searchSubject.next(value);
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadFlats();
    }

    onPageSizeChange(): void {
        this.currentPage = 0;
        this.loadFlats();
    }
'''
content = re.sub(methods_search, methods_replacement, content, flags=re.DOTALL)


with open('src/app/features/units/society-units.component.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Component")
