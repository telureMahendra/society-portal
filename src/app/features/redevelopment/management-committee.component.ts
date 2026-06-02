import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  email: string;
  joinedDate: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-management-committee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="committee-container">
    <div class="page-header">
      <div>
        <p class="subtitle-label">Governance Boards</p>
        <h1>Management Committee</h1>
        <p class="subtitle">Elected resident committee overseeing strategic operational blueprints and regulatory compliance.</p>
      </div>
      <button class="primary-button" (click)="isAddOpen = true">
        <i class="fas fa-user-plus"></i>
        Add Member
      </button>
    </div>

    <div class="controls-section">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Search by name, role or email..." [(ngModel)]="searchQuery" />
      </div>
    </div>

    <section class="members-grid" *ngIf="filteredMembers.length > 0; else emptyState">
      <article class="member-card" *ngFor="let member of filteredMembers">
        <div class="card-header">
          <img [src]="member.avatarUrl" [alt]="member.name" class="member-avatar" />
          <button class="delete-button" (click)="removeMember(member.id)" type="button">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <h3>{{ member.name }}</h3>
        <p class="member-role">{{ member.role }}</p>
        <div class="member-meta">
          <div class="meta-item">
            <i class="fas fa-envelope"></i>
            {{ member.email }}
          </div>
          <div class="meta-item">
            <i class="fas fa-calendar"></i>
            {{ member.joinedDate }}
          </div>
        </div>
      </article>
    </section>

    <ng-template #emptyState>
      <div class="empty-state">
        <p>No management committee members found matching your search.</p>
      </div>
    </ng-template>

    <!-- Add Member Modal -->
    <div class="modal-backdrop" *ngIf="isAddOpen" (click)="isAddOpen = false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Add Committee Member</h2>
          <button class="close-button" (click)="isAddOpen = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form (ngSubmit)="addMember()" class="modal-form">
          <label>
            <span>Full Name</span>
            <input type="text" required [(ngModel)]="fullName" name="fullName" placeholder="Enter member name" />
          </label>

          <label>
            <span>Role</span>
            <select [(ngModel)]="role" name="role">
              <option *ngFor="let r of rolesList" [value]="r">{{ r }}</option>
            </select>
          </label>

          <label>
            <span>Email Address</span>
            <input type="email" required [(ngModel)]="email" name="email" placeholder="member@example.com" />
          </label>

          <label>
            <span>Joined Date</span>
            <input type="text" [(ngModel)]="joinedDate" name="joinedDate" placeholder="Since Jan 2023" />
          </label>

          <div class="modal-actions">
            <button type="button" class="secondary-button" (click)="isAddOpen = false">Cancel</button>
            <button type="submit" class="primary-button">Add Member</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .committee-container {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      padding-bottom: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
    }

    .subtitle-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 0.5rem;
    }

    h1 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      font-weight: 700;
      color: #0f172a;
    }

    .subtitle {
      margin: 0;
      color: #64748b;
      font-size: 0.95rem;
    }

    .primary-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s ease;
    }

    .primary-button:hover {
      background: #1d4ed8;
    }

    .controls-section {
      display: flex;
      gap: 1rem;
    }

    .search-bar {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
    }

    .search-bar i {
      color: #94a3b8;
    }

    .search-bar input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      color: #0f172a;
    }

    .members-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    .member-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: all 0.2s ease;
    }

    .member-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .member-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e2e8f0;
    }

    .delete-button {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }

    .delete-button:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .member-card h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
    }

    .member-role {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    .member-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      color: #64748b;
      font-size: 0.85rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .empty-state {
      padding: 2rem;
      text-align: center;
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 1rem;
      color: #64748b;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 40;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 1rem;
      width: min(100%, 500px);
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #0f172a;
    }

    .close-button {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 1.25rem;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
    }

    .modal-form label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .modal-form span {
      font-weight: 600;
      color: #334155;
      font-size: 0.9rem;
    }

    .modal-form input,
    .modal-form select {
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      color: #0f172a;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .secondary-button {
      background: #f1f5f9;
      color: #334155;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .secondary-button:hover {
      background: #e2e8f0;
    }
  `]
})
export class ManagementCommitteeComponent {
  isAddOpen = false;
  searchQuery = '';
  fullName = '';
  role = 'Committee Chair';
  email = '';
  joinedDate = 'Since Jan 2024';

  rolesList = [
    'Committee Chair',
    'Operations Lead',
    'Financial Controller',
    'Compliance Officer',
    'Safety Inspector',
    'Community Liaison'
  ];

  members: CommitteeMember[] = [
    {
      id: 'm1',
      name: 'Dhulaji Pandhare',
      role: 'Committee Chair',
      email: 'dhulaji@gmail.com',
      joinedDate: 'Since Oct 2022',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD7IHia9ACiH8JISd3zlFuIUQsxPAF0WBeQTbXqP8HS6lXqh7OBc_D5AJnjsvE2jJl4tzL9RkaxBt1M1NmGQIwDUwtPM4gDI1M6PA-wk8RULVNejGmZjG0Sedfy8Lxu5yDhcJbL8GVuczHMP-fNeAH3WODSKXuYb9IUSeOHy5y4hSmERwYxjM4JG3cdz0LQBnZHUVv28ZINZY6xSG5ttyodjjPRIZZ0qKSAD0qTqzw8QXuwOC55YHkch4tAjs7zFHUcjrHbyy8qTxD'
    },
    {
      id: 'm2',
      name: 'Chetan Vichare',
      role: 'Operations Lead',
      email: 'chetan.vichare@gmail.com',
      joinedDate: 'Since Jan 2023',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBS-ts_-QRyWavg26Iuz_UgeMGiObH7_0bnUNmhzGpIHlyKHaovDgzXbFyt-_lpjvz_K96JnscK1_T1bKnddmW2ZtnB-FMjhaRAe4MKWW8u0yfOZkkkaHh9ZgUCdv_kFHOqTo3MrGZbuVqb3LB4eFlyAe_Lu-oS54LTTIdIJgRYYbgi6a_eTlRgZTRAkELYL69x3XfAfz3fT1kO_iwugw6ygFN2YQkJv1iGlNO8Dlq6CfBn2TmoDYZaJShWKMgW_wVHe_r_anaWhQuJ'
    },
    {
      id: 'm3',
      name: 'Rupali Sambre',
      role: 'Financial Controller',
      email: 'rupali.sambre@gmail.com',
      joinedDate: 'Since Mar 2023',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnE6RNQpXO-sxEzgFmsKoReAgR1_wrgedcJRCO6pe16B8Gvqi49-CaFCytJqr4VPLsrvHJw1nflAa36TcUVp6F3MM-oktF0eYHYqFfdE0_2yasO2xSdBcMPajiYJsU0au3MeCkzAMNcqEbuLJtFzWRi6XDP7OXV-KfVEuZ1MD5PRygXtyHGWhhsetjco5v534LwfjeQjkiW8hBf9TczvtF57Zh2YDa8QBQxqjjF_1frNWFpZcN8psbq3p7TIEtS49gDCv3vY05rZEU'

    }
  ];

  get filteredMembers(): CommitteeMember[] {
    if (!this.searchQuery.trim()) return this.members;
    const query = this.searchQuery.toLowerCase();
    return this.members.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.role.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query)
    );
  }

  addMember() {
    if (!this.fullName.trim() || !this.email.trim()) return;

    const avatars = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBeXukP4i3sL9-C3NmEoUPdt2Fbs0msTnpHkN0YlBNkeYfQkDxQXD0xmmyFaP2Fcft9GDph1I17d-rptHhIbMxj4QV9katJubNhp8RLLReIMFXvVdzhv9w9Fufh_6zOdRJACD8Xd9HjYzT7OAjpE5a5aFsISZXaCLdossrBxLZfUwFCMmweiIgGuaWNHlwhxpCq6Ezzk2lfOutM3mMGHvYO59danm_oYH619pBwOJJQa-IJFTCoJPxzJcQmHPBGfETL77Zoc8ARsHqs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBS-ts_-QRyWavg26Iuz_UgeMGiObH7_0bnUNmhzGpIHlyKHaovDgzXbFyt-_lpjvz_K96JnscK1_T1bKnddmW2ZtnB-FMjhaRAe4MKWW8u0yfOZkkkaHh9ZgUCdv_kFHOqTo3MrGZbuVqb3LB4eFlyAe_Lu-oS54LTTIdIJgRYYbgi6a_eTlRgZTRAkELYL69x3XfAfz3fT1kO_iwugw6ygFN2YQkJv1iGlNO8Dlq6CfBn2TmoDYZaJShWKMgW_wVHe_r_anaWhQuJ'
    ];

    this.members.push({
      id: `m_${Date.now()}`,
      name: this.fullName,
      role: this.role,
      email: this.email,
      joinedDate: this.joinedDate,
      avatarUrl: avatars[Math.floor(Math.random() * avatars.length)]
    });

    this.fullName = '';
    this.email = '';
    this.joinedDate = 'Since Jan 2024';
    this.isAddOpen = false;
  }

  removeMember(id: string) {
    this.members = this.members.filter(m => m.id !== id);
  }
}
