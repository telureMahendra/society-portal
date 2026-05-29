const fs = require('fs');
let content = fs.readFileSync('src/app/features/units/society-units.component.ts', 'utf8');

// 1. Add view toggle
content = content.replace(
    '<div class="search-box">',
    `<div class="view-toggle">
                <button [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'"><i class="fas fa-th-large"></i></button>
                <button [class.active]="viewMode === 'table'" (click)="viewMode = 'table'"><i class="fas fa-list"></i></button>
              </div>
              <div class="search-box">`
);

// 2. Wrap grid
content = content.replace(
    '<div class="flats-grid">',
    '<div class="flats-grid" *ngIf="viewMode === \'grid\'">'
);

// 3. Add table
const tableHtml = `
          <div class="flats-table-container glass-card" *ngIf="viewMode === 'table'">
            <table class="flats-table">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Resident/Owner</th>
                  <th>Type</th>
                  <th>Area</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let flat of displayedFlats">
                  <td><strong>{{ selectedWing.name.split(' ')[1] }}-{{ flat.flatNumber }}</strong></td>
                  <td><span class="status-badge" [class]="flat.occupancyStatus.toLowerCase()">{{ flat.occupancyStatus }}</span></td>
                  <td>{{ flat.ownerName }}</td>
                  <td>{{ flat.residentType }}</td>
                  <td>{{ flat.areaSqFt }} Sq Ft</td>
                  <td class="table-actions">
                    <button class="btn-icon-small" (click)="openOwnerModal(flat)" title="Manage Owner"><i class="fas fa-user-edit"></i></button>
                    <button class="btn-icon-small" title="View History"><i class="fas fa-history"></i></button>
                    <button class="btn-icon-small" title="Manage Billing"><i class="fas fa-file-invoice-dollar"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
`;

content = content.replace(
    '<div *ngIf="displayedFlats.length === 0" class="empty-state">',
    tableHtml + '\n          <div *ngIf="displayedFlats.length === 0" class="empty-state">'
);

// 4. Add CSS
const cssAddition = `
    .view-controls { display: flex; gap: 1rem; align-items: center; }
    .view-toggle { display: flex; background: #f1f5f9; padding: 0.25rem; border-radius: 0.5rem; gap: 0.25rem; }
    .view-toggle button { border: none; background: transparent; padding: 0.5rem 0.75rem; border-radius: 0.375rem; cursor: pointer; color: #64748b; transition: all 0.2s; }
    .view-toggle button.active { background: white; color: #2563eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    
    .flats-table-container { overflow-x: auto; border-radius: 1rem; margin-bottom: 1.5rem; }
    .flats-table { width: 100%; border-collapse: collapse; text-align: left; }
    .flats-table th { padding: 1rem 1.5rem; background: #f8fafc; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
    .flats-table td { padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
    .flats-table tbody tr:last-child td { border-bottom: none; }
    .flats-table tbody tr:hover { background: #f8fafc; }
    .table-actions { display: flex; gap: 0.5rem; }
    .btn-icon-small { width: 28px; height: 28px; border-radius: 0.375rem; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
    .btn-icon-small:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
`;

content = content.replace(
    '/* Modal Styles */',
    cssAddition + '\n    /* Modal Styles */'
);

// 5. Add viewMode state property
content = content.replace(
    'wings: Wing[] = [];',
    'viewMode: \'grid\' | \'table\' = \'grid\';\n    wings: Wing[] = [];'
);

fs.writeFileSync('src/app/features/units/society-units.component.ts', content, 'utf8');
console.log('Updated component');
