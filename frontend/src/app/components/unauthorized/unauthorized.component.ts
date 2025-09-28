import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.component.html',
  standalone: true,
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

  /**
   * router permet de naviguer entre les différentes pages de l'application
   * @private
   */
  private router = inject(Router);

  /**
   * Methode pour naviguer vers la page d'accueil
   */
  goHome() {
    return this.router.navigate(['/']);
  }
}
