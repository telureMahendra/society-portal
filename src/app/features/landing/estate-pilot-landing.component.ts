import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-estate-pilot-landing',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="landing-container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="logo-area">
          <img src="/logo.jpg" alt="EstatePilot Logo" class="logo">
          <span class="brand">EstatePilot</span>
        </div>
        <div class="nav-links">
          <a routerLink="/login" class="btn btn-outline">Society Login</a>
          <a routerLink="/platform" class="btn btn-primary">Platform Admin</a>
        </div>
      </nav>

      <!-- Hero Section -->
      <header class="hero">
        <div class="hero-content">
          <h1 class="animate-up">Smart Living, <span>Elevated.</span></h1>
          <p class="animate-up delay-1">The most comprehensive society management ecosystem built for modern communities. Streamline billing, notices, and interactions with ease.</p>
          <div class="hero-actions animate-up delay-2">
            <a routerLink="/login" class="btn btn-large btn-primary">Get Started</a>
            <a href="#features" class="btn btn-large btn-outline">Explore Features</a>
          </div>
        </div>
        <div class="hero-visual animate-fade">
          <div class="glass-card main-card">
            <div class="card-header">
              <div class="dot red"></div>
              <div class="dot yellow"></div>
              <div class="dot green"></div>
            </div>
            <div class="card-content">
              <div class="line long"></div>
              <div class="line med"></div>
              <div class="line short"></div>
              <div class="stats-row">
                <div class="stat-box"></div>
                <div class="stat-box"></div>
                <div class="stat-box"></div>
              </div>
            </div>
          </div>
          <div class="glass-card float-card p-1">
            <i class="fas fa-file-invoice-dollar"></i>
            <span>Auto Billing</span>
          </div>
          <div class="glass-card float-card p-2">
            <i class="fas fa-bullhorn"></i>
            <span>Instant Notices</span>
          </div>
        </div>
      </header>

      <!-- Features Section -->
      <section id="features" class="features">
        <div class="section-header">
          <h2>Everything you need to <span>Pilot</span> your estate</h2>
          <p>Powerful tools designed to simplify the complexities of society management.</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="icon-wrap billing">
              <i class="fas fa-credit-card"></i>
            </div>
            <h3>Automated Billing</h3>
            <p>Generate maintenance bills, track payments, and send reminders automatically every month.</p>
          </div>
          
          <div class="feature-card">
            <div class="icon-wrap notices">
              <i class="fas fa-bell"></i>
            </div>
            <h3>Smart Notices</h3>
            <p>Broadcast important updates to all residents instantly via web and mobile push notifications.</p>
          </div>
          
          <div class="feature-card">
            <div class="icon-wrap security">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3>Visitor Control</h3>
            <p>Manage entry and exit points with digital logs, ensuring maximum security for your community.</p>
          </div>
          
          <div class="feature-card">
            <div class="icon-wrap events">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <h3>Event Planning</h3>
            <p>Organize society events, book ammenities, and manage RSVPs in one central calendar.</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-bottom">
          <p>&copy; 2026 EstatePilot. Built on Trust. Driven by Value.</p>
        </div>
      </footer>
    </div>
  `,
    styles: [`
    :host {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --text: #0f172a;
      --text-light: #64748b;
      --bg: #f8fafc;
      --white: #ffffff;
      --glass: rgba(255, 255, 255, 0.7);
    }

    .landing-container {
      font-family: 'Outfit', sans-serif;
      color: var(--text);
      background: var(--bg);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Navbar */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 5%;
      background: var(--glass);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo {
      height: 42px;
      border-radius: 8px;
    }

    .brand {
      font-size: 1.4rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text);
    }

    .nav-links {
      display: flex;
      gap: 1rem;
    }

    /* Buttons */
    .btn {
      padding: 0.6rem 1.2rem;
      border-radius: 0.5rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      display: inline-block;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }

    .btn-outline {
      border: 1px solid #e2e8f0;
      color: var(--text);
      background: var(--white);
    }

    .btn-outline:hover {
      background: #f1f5f9;
    }

    .btn-large {
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }

    /* Hero */
    .hero {
      display: flex;
      align-items: center;
      padding: 6rem 5%;
      gap: 4rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-content {
      flex: 1;
    }

    .hero-content h1 {
      font-size: 4rem;
      line-height: 1.1;
      font-weight: 900;
      margin-bottom: 1.5rem;
      letter-spacing: -0.04em;
    }

    .hero-content h1 span {
      background: linear-gradient(to right, #2563eb, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-content p {
      font-size: 1.25rem;
      color: var(--text-light);
      line-height: 1.6;
      margin-bottom: 2.5rem;
      max-width: 540px;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
    }

    .hero-visual {
      flex: 1;
      position: relative;
      display: flex;
      justify-content: center;
    }

    /* Visual Elements */
    .glass-card {
      background: var(--glass);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.4);
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1);
    }

    .main-card {
      width: 400px;
      height: 300px;
      padding: 1.5rem;
    }

    .card-header {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .red { background: #ff5f56; }
    .yellow { background: #ffbd2e; }
    .green { background: #27c93f; }

    .line { height: 8px; border-radius: 4px; background: #e2e8f0; margin-bottom: 1rem; }
    .long { width: 100%; }
    .med { width: 70%; }
    .short { width: 40%; }

    .stats-row { display: flex; gap: 1rem; margin-top: 2rem; }
    .stat-box { flex: 1; height: 80px; border-radius: 0.75rem; background: #f1f5f9; }

    .float-card {
      position: absolute;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .float-card i { font-size: 1.2rem; }
    .p-1 { top: -20px; right: 20px; color: #059669; }
    .p-2 { bottom: -20px; left: 20px; color: #2563eb; }

    /* Features */
    .features {
      padding: 6rem 5%;
      max-width: 1400px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
    }

    .section-header h2 span { color: var(--primary); }

    .section-header p {
      color: var(--text-light);
      font-size: 1.1rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: var(--white);
      padding: 2.5rem;
      border-radius: 1.5rem;
      transition: all 0.3s;
      border: 1px solid #f1f5f9;
    }

    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05);
      border-color: #e2e8f0;
    }

    .icon-wrap {
      width: 60px;
      height: 60px;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .billing { background: #eff6ff; color: #2563eb; }
    .notices { background: #fef2f2; color: #dc2626; }
    .security { background: #ecfdf5; color: #059669; }
    .events { background: #fefce8; color: #ca8a04; }

    .feature-card h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; }
    .feature-card p { color: var(--text-light); line-height: 1.6; font-size: 0.95rem; }

    /* Footer */
    .footer {
      padding: 4rem 5% 2rem;
      border-top: 1px solid #e2e8f0;
      margin-top: 4rem;
    }

    .footer-bottom {
      text-align: center;
      color: var(--text-light);
      font-size: 0.9rem;
    }

    /* Animations */
    .animate-up {
      animation: up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }

    .animate-fade {
      animation: fade 1.2s ease-out forwards;
      opacity: 0;
    }

    .delay-1 { animation-delay: 0.2s; }
    .delay-2 { animation-delay: 0.4s; }

    @keyframes up {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes fade {
      from { opacity: 0; filter: blur(10px); }
      to { opacity: 1; filter: blur(0); }
    }

    /* Responsive */
    @media (max-width: 992px) {
      .hero { flex-direction: column; text-align: center; padding: 4rem 5%; }
      .hero-content h1 { font-size: 3rem; }
      .hero-content p { margin: 0 auto 2.5rem; }
      .hero-actions { justify-content: center; }
      .hero-visual { width: 100%; margin-top: 2rem; }
      .main-card { width: 100%; max-width: 400px; }
    }
  `]
})
export class EstatePilotLandingComponent { }
