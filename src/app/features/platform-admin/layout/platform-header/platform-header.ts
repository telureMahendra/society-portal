import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-platform-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './platform-header.html',
  styleUrl: './platform-header.scss',
})
export class PlatformHeader implements OnInit {
  currentPageTitle = 'Dashboard';
  userName = 'Platform Admin';
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.username;
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }
}
