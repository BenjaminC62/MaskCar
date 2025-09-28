import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent {

  /**
   * Service d'authentification qui permet de récupérer les données de l'utilisateur connecté
   * @private
   */
  public authService = inject(AuthService);
  /**
   * Service de gestion des routes qui permet de naviguer entre les différentes pages de l'application
   * @private
   */
  public router = inject(Router);

  /**
   * Methode qui permet de se déconnecter de l'application
   * @returns void
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }


  /**
   * Methode qui permet d'obtenir l'utilisateur connecté
   * @returns void
   */
  get user() {
    return this.authService.user();
  }

  /**
   * Methode qui permet de savoir si l'utilisateur est connecté
   * @returns void
   */
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * Methode qui permet de savoir si l'utilisateur est un client
   * @returns void
   */
  get isClient(): boolean {
    return this.user?.role === 'client';
  }

  /**
   * Methode qui permet de savoir si l'utilisateur est un agent ou un admin
   * @returns void
   */
  get isAgentOrAdmin(): boolean {
    return ['agent', 'admin'].includes(this.user?.role);
  }


}
