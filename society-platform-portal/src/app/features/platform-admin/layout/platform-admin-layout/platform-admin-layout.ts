import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlatformSidebar } from '../platform-sidebar/platform-sidebar';
import { PlatformHeader } from '../platform-header/platform-header';

@Component({
  selector: 'app-platform-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, PlatformSidebar, PlatformHeader],
  templateUrl: './platform-admin-layout.html',
  styleUrl: './platform-admin-layout.scss',
})
export class PlatformAdminLayout {

}
