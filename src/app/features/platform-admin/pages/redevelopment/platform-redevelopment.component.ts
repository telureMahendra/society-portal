import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RedevelopmentMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  tags: string[];
  avatarUrl: string;
}

interface TimelineStep {
  label: string;
  status: 'done' | 'active' | 'upcoming';
  desc: string;
}

@Component({
  selector: 'app-platform-redevelopment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="page-shell">
    <div class="page-header">
      <div>
        <div class="breadcrumb">Committees · <span>Redevelopment Committee</span></div>
        <h1>Redevelopment Board</h1>
        <p class="subtitle">Track redevelopment specialists, milestone phases, and approvals in one central control pane.</p>
      </div>

      <button class="primary-button" type="button" (click)="isAddOpen = true">
        <i class="fas fa-user-plus"></i>
        Add Specialist
      </button>
    </div>

    <div class="controls-row">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Search specialist, role, email or tag..." [(ngModel)]="searchQuery" />
      </div>
      <div class="stats-panel">
        <div class="stat-card">
          <span class="stat-label">Current Phase</span>
          <strong>Approval Phase</strong>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total Specialists</span>
          <strong>{{ members.length }}</strong>
        </div>
      </div>
    </div>

    <section class="member-grid" *ngIf="filteredMembers.length; else emptyState">
      <article class="member-card" *ngFor="let member of filteredMembers">
        <div class="member-top">
          <div class="member-avatar">
            <img [src]="member.avatarUrl" [alt]="member.name" />
          </div>
          <button class="remove-btn" type="button" (click)="removeMember(member.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <h2>{{ member.name }}</h2>
        <p class="member-role">{{ member.role }}</p>
        <div class="member-tags">
          <span class="tag" *ngFor="let tag of member.tags">{{ tag }}</span>
        </div>
        <div class="member-contact">
          <div><i class="fas fa-envelope"></i> {{ member.email }}</div>
          <div><i class="fas fa-phone"></i> {{ member.phone }}</div>
        </div>
      </article>
    </section>

    <ng-template #emptyState>
      <div class="empty-state">
        No specialised redevelopment specialists match your search.
      </div>
    </ng-template>

    <section class="timeline-panel">
      <div class="timeline-header">
        <h2>Project Lifecycle Map</h2>
        <p>Sequential phase tracking showing progress and active gates.</p>
      </div>
      <div class="timeline-items">
        <article class="timeline-step" *ngFor="let step of timelineSteps">
          <div class="timeline-badge" [ngClass]="step.status">
            <span *ngIf="step.status !== 'done'">{{ timelineSteps.indexOf(step) + 1 }}</span>
            <i *ngIf="step.status === 'done'" class="fas fa-check"></i>
          </div>
          <div>
            <strong [ngClass]="step.status">{{ step.label }}</strong>
            <p>{{ step.desc }}</p>
          </div>
        </article>
      </div>
    </section>

    <div class="modal-backdrop" *ngIf="isAddOpen">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3>Add Technical Specialist</h3>
            <p>Provide the key details for the redevelopment committee member.</p>
          </div>
          <button class="icon-button" type="button" (click)="isAddOpen = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form (ngSubmit)="addMember()" class="modal-form">
          <label>
            <span>Full Name</span>
            <input type="text" required [(ngModel)]="fullName" name="fullName" placeholder="e.g. Robert Sterling" />
          </label>

          <label>
            <span>Responsibility Domain</span>
            <select [(ngModel)]="role" name="role">
              <option *ngFor="let roleOption of rolesList" [value]="roleOption">{{ roleOption }}</option>
            </select>
          </label>

          <label>
            <span>Email Connection</span>
            <input type="email" required [(ngModel)]="email" name="email" placeholder="e.g. r.sterling@adminportal.com" />
          </label>

          <label>
            <span>Telephone Contact</span>
            <input type="text" [(ngModel)]="phone" name="phone" placeholder="e.g. +1 (555) 012-3456" />
          </label>

          <label>
            <span>Domain Tags (comma-separated)</span>
            <input type="text" [(ngModel)]="tagInput" name="tagInput" placeholder="e.g. Engineering, Structural" />
          </label>

          <div class="modal-actions">
            <button type="button" class="secondary-button" (click)="isAddOpen = false">Cancel</button>
            <button type="submit" class="primary-button">Save Specialist</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `,
  styles: [
    `
    .page-shell {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      padding-bottom: 3rem;
    }

    .page-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
      align-items: flex-start;
    }

    .breadcrumb {
      color: #64748b;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }

    .breadcrumb span {
      color: #0f172a;
      font-weight: 700;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.75rem, 2vw, 2.5rem);
      color: #0f172a;
    }

    .subtitle {
      margin: 0.65rem 0 0;
      color: #475569;
      max-width: 680px;
    }

    .primary-button,
    .secondary-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
      border-radius: 1rem;
      padding: 0.9rem 1.4rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s ease, background-color 0.2s ease;
    }

    .primary-button {
      background: #2563eb;
      color: white;
    }

    .primary-button:hover {
      transform: translateY(-1px);
      background: #1d4ed8;
    }

    .secondary-button {
      background: #f8fafc;
      color: #334155;
      border: 1px solid #cbd5e1;
    }

    .controls-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1rem;
      align-items: center;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      padding: 0.8rem 1rem;
    }

    .search-box i {
      color: #64748b;
      font-size: 0.95rem;
    }

    .search-box input {
      border: none;
      outline: none;
      width: 100%;
      font-size: 0.95rem;
      color: #0f172a;
      background: transparent;
    }

    .stats-panel {
      display: grid;
      grid-template-columns: repeat(2, minmax(120px, 1fr));
      gap: 0.75rem;
    }

    .stat-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      padding: 1rem 1.15rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-label {
      text-transform: uppercase;
      font-size: 0.7rem;
      color: #94a3b8;
      letter-spacing: 0.08em;
    }

    .member-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
    }

    .member-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 1.5rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-height: 260px;
    }

    .member-top {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 1rem;
    }

    .member-avatar img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e2e8f0;
    }

    .remove-btn,
    .icon-button {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #475569;
      border-radius: 999px;
      width: 2.5rem;
      height: 2.5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .remove-btn:hover,
    .icon-button:hover {
      background: #f1f5f9;
    }

    .member-card h2 {
      margin: 0;
      font-size: 1.1rem;
      color: #0f172a;
    }

    .member-role {
      margin: 0;
      color: #64748b;
      font-size: 0.85rem;
    }

    .member-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      background: #f1f5f9;
      color: #334155;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .member-contact {
      display: grid;
      gap: 0.5rem;
      color: #475569;
      font-size: 0.85rem;
    }

    .member-contact i {
      margin-right: 0.5rem;
      color: #64748b;
    }

    .timeline-panel {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 1.5rem;
      padding: 1.5rem;
    }

    .timeline-header h2 {
      margin: 0 0 0.25rem;
      font-size: 1.05rem;
      color: #0f172a;
    }

    .timeline-header p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    .timeline-items {
      display: grid;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .timeline-step {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .timeline-badge {
      min-width: 2.5rem;
      min-height: 2.5rem;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-weight: 700;
      color: white;
      background: #cbd5e1;
    }

    .timeline-badge.done {
      background: #16a34a;
    }

    .timeline-badge.active {
      background: #2563eb;
    }

    .timeline-badge.upcoming {
      background: #94a3b8;
    }

    .timeline-step strong {
      display: block;
      margin-bottom: 0.35rem;
      color: #0f172a;
    }

    .timeline-step strong.active {
      color: #2563eb;
    }

    .timeline-step p {
      margin: 0;
      color: #475569;
      font-size: 0.9rem;
      line-height: 1.45;
    }

    .empty-state {
      padding: 2rem;
      border: 2px dashed #cbd5e1;
      border-radius: 1rem;
      text-align: center;
      color: #64748b;
      background: #f8fafc;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      display: grid;
      place-items: center;
      padding: 1.5rem;
      z-index: 50;
    }

    .modal-card {
      width: min(100%, 560px);
      background: white;
      border-radius: 1.5rem;
      padding: 1.5rem;
      box-shadow: 0 35px 80px rgba(15, 23, 42, 0.14);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.15rem;
      color: #0f172a;
    }

    .modal-header p {
      margin: 0.35rem 0 0;
      color: #64748b;
      font-size: 0.92rem;
    }

    .modal-form {
      display: grid;
      gap: 1rem;
    }

    .modal-form label {
      display: grid;
      gap: 0.45rem;
      font-size: 0.8rem;
      color: #475569;
    }

    .modal-form input,
    .modal-form select {
      width: 100%;
      border: 1px solid #e2e8f0;
      border-radius: 0.95rem;
      padding: 0.85rem 1rem;
      outline: none;
      color: #0f172a;
      background: #f8fafc;
      font-size: 0.95rem;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    @media (max-width: 900px) {
      .controls-row {
        grid-template-columns: 1fr;
      }

      .stats-panel {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 640px) {
      .page-header,
      .modal-header {
        flex-direction: column;
        align-items: stretch;
      }

      .stats-panel {
        grid-template-columns: 1fr;
      }
    }
    `
  ]
})
export class PlatformRedevelopmentComponent {
  isAddOpen = false;
  searchQuery = '';
  fullName = '';
  role = 'Structural Lead';
  email = '';
  phone = '';
  tagInput = '';

  rolesList = [
    'Structural Lead',
    'Planning Consultant',
    'Lead Architect',
    'Zoning Specialist',
    'Financial Controller',
    'Environmental Advisor'
  ];

  members: RedevelopmentMember[] = [
    {
      id: 'r1',
      name: 'Akash Dhamak',
      role: 'Structural Lead',
      email: 'akash@gmail.com.com',
      phone: '+1 (555) 012-3456',
      tags: ['Senior', 'Engineering'],
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD7IHia9ACiH8JISd3zlFuIUQsxPAF0WBeQTbXqP8HS6lXqh7OBc_D5AJnjsvE2jJl4tzL9RkaxBt1M1NmGQIwDUwtPM4gDI1M6PA-wk8RULVNejGmZjG0Sedfy8Lxu5yDhcJbL8GVuczHMP-fNeAH3WODSKXuYb9IUSeOHy5y4hSmERwYxjM4JG3cdz0LQBnZHUVv28ZINZY6xSG5ttyodjjPRIZZ0qKSAD0qTqzw8QXuwOC55YHkch4tAjs7zFHUcjrHbyy8qTxD'
    },
    {
      id: 'r2',
      name: 'Rupali Sambre',
      role: 'Planning Consultant',
      email: 'rupali.sambre@gmail.com',
      phone: '+1 (555) 098-7654',
      tags: ['Zoning', 'Legal'],
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnE6RNQpXO-sxEzgFmsKoReAgR1_wrgedcJRCO6pe16B8Gvqi49-CaFCytJqr4VPLsrvHJw1nflAa36TcUVp6F3MM-oktF0eYHYqFfdE0_2yasO2xSdBcMPajiYJsU0au3MeCkzAMNcqEbuLJtFzWRi6XDP7OXV-KfVEuZ1MD5PRygXtyHGWhhsetjco5v534LwfjeQjkiW8hBf9TczvtF57Zh2YDa8QBQxqjjF_1frNWFpZcN8psbq3p7TIEtS49gDCv3vY05rZEU'
    },
    {
      id: 'r3',
      name: 'Mahendra Telure',
      role: 'Lead Architect',
      email: 'mahendra@gmail.com',
      phone: '+1 (555) 234-5678',
      tags: ['Design', 'Sustainability'],
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_Rqq2fXk9RGuMpnborFxK1bn7w64GA_vMx4K2gOL2Slcd0TKYb08HKcOc6TQaxQmQu7nRG7a7A6h_RCOyxOP4VecU0L8lFDeKN1P1sC5Xy9mRQaWRu9jplpSlJ9xTIw6q5x5Yxnnyo2KZdKNKGb9-p6zp5z8UalOCgvnoRHIItxlQydH_1x9yx9w3lB7hseHi20toLn0WhRWy1BRxzO2ut_8MEKVLLSiUCL7bpPRJux-Mx4s-iWHD7gttsHDgvViW1UwsShI6sSyk'
    },
   
  ];

  timelineSteps: TimelineStep[] = [
    { label: 'Initiation', status: 'done', desc: 'Planning blueprints & initial regulatory surveys approved.' },
    { label: 'Analysis', status: 'done', desc: 'Geotechnical soil reviews & seismic core modeling.' },
    { label: 'Approval Phase', status: 'active', desc: 'FSI zoning clears & structural tenders audit.' },
    { label: 'Execution', status: 'upcoming', desc: 'Primary core construction and structural rigging.' },
    { label: 'Completion', status: 'upcoming', desc: 'Facade restoration, final municipal sign-offs.' }
  ];

  get filteredMembers(): RedevelopmentMember[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.members;
    }
    return this.members.filter(member =>
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  addMember() {
    if (!this.fullName.trim() || !this.email.trim()) {
      return;
    }

    const avatars = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnE6RNQpXO-sxEzgFmsKoReAgR1_wrgedcJRCO6pe16B8Gvqi49-CaFCytJqr4VPLsrvHJw1nflAa36TcUVp6F3MM-oktF0eYHYqFfdE0_2yasO2xSdBcMPajiYJsU0au3MeCkzAMNcqEbuLJtFzWRi6XDP7OXV-KfVEuZ1MD5PRygXtyHGWhhsetjco5v534LwfjeQjkiW8hBf9TczvtF57Zh2YDa8QBQxqjjF_1frNWFpZcN8psbq3p7TIEtS49rdc3vY05rZEU',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmnlbGhr6_lUZtuW-QW-t2jLgp-7s0yfR6dETAs0zt99JnjurZ8UmcUTeSDKL71tcvP-Hfle0ME-G-DuXQWV0e1vqGYeSO-sVgUpRYGqr_0KhbegMX9FzRbqidkTF6_gR96oqJ5NTxvXTjRFiZhBbmF6zs7xw6A0RTdS0yj57XYvc_mwVyY33BZWkr8hUcfn2ZGlKTKlponDFnrn2V6EJQID7pZQGI3IYTnYJKBBCJRIHHTXcYaAWy-PtgSe1tQnKe-BYNgc0vWDGi',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBD7IHia9ACiH8JISd3zlFuIUQsxPAF0WBeQTbXqP8HS6lXqh7OBc_D5AJnjsvE2jJl4tzL9RkaxBt1M1NmGQIwDUwtPM4gDI1M6PA-wk8RULVNejGmZjG0Sedfy8Lxu5yDhcJbL8GVuczHMP-fNeAH3WODSKXuYb9IUSeOHy5y4hSmERwYxjM4JG3cdz0LQBnZHUVv28ZINZY6xSG5ttyodjjPRIZZ0qKSAD0qTqzw8QXuwOC55YHkch4tAjs7zFHUcjrHbyy8qTxD',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_Rqq2fXk9RGuMpnborFxK1bn7w64GA_vMx4K2gOL2Slcd0TKYb08HKcOc6TQaxQmQu7nRG7a7A6h_RCOyxOP4VecU0L8lFDeKN1P1sC5Xy9mRQaWRu9jplpSlJ9xTIw6q5x5Yxnnyo2KZdKNKGb9-p6zp5z8UalOCgvnoRHIItxlQydH_1x9yx9w3lB7hseHi20toLn0WhRWy1BRxzO2ut_8MEKVLLSiUCL7bpPRJux-Mx4s-iWHD7gttsHDgvViW1UwsShI6sSyk',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBG49hpB8QD5PcAuZ9KRHQOSIsDcJR31oxaNulQqa5iQ2lA9Gh4yvDVqbEEsKO1yYmBh3gxd3--_mXJeGAqRWh8cCYXqo0Z10iEJ-ppDyJD8pn3pfpluBhUslHs775LGT95C-8dAagU2Iw-70kaRMkVXBVM7qkPtGAWqZJSpGXxsEazC49u-Zntw96q4zG0Q9ITFX7eiROASNCc2pfuxLaprkVy_wSYXukE9n7kDoGYPnKvYqOlZCuMVOZDadCnA3oIXea2D3-LYxC'
    ];

    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const tags = this.tagInput
      ? this.tagInput.split(',').map(tag => tag.trim()).filter(Boolean)
      : ['Specialist'];

    const newMember: RedevelopmentMember = {
      id: `r_${Date.now()}`,
      name: this.fullName.trim(),
      role: this.role,
      email: this.email.trim(),
      phone: this.phone.trim() || '+1 (555) 123-4567',
      tags,
      avatarUrl: randomAvatar
    };

    this.members = [...this.members, newMember];
    this.fullName = '';
    this.email = '';
    this.phone = '';
    this.tagInput = '';
    this.isAddOpen = false;
  }

  removeMember(memberId: string) {
    this.members = this.members.filter(member => member.id !== memberId);
  }
}
