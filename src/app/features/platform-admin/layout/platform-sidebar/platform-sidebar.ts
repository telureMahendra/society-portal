import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-platform-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './platform-sidebar.html',
  styleUrl: './platform-sidebar.scss',
})
export class PlatformSidebar {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
