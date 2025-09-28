import { Component, computed, inject } from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  standalone: true
})
export class FooterComponent {
  private auth = inject(AuthService);
  user = this.auth.user;

  isAdmin = computed(() => this.user()?.role === 'admin');
  isClient = computed(() => this.user()?.role === 'client');
  isLoggedIn = this.auth.isLoggedIn;
}


