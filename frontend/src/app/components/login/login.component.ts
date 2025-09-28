import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService} from '../../services/auth.service';
import {NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {Identite} from '../../models/User';
import {MatIcon} from '@angular/material/icon';


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatIcon,
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /**
   * FormBuilder qui permet de créer des formulaires réactifs
   * @private
   */
  fb = inject(FormBuilder);
  /**
   * Service d'authentification qui permet de récupérer les données de l'utilisateur connecté
   * @private
   */
  authService = inject(AuthService);
  /**
   * Service de gestion des routes qui permet de naviguer entre les différentes pages de l'application
   * @private
   */
  router = inject(Router);
  /**
   * SnackBar qui permet d'afficher des messages de notification
   */
  snackBar = inject(MatSnackBar);

  /**
   * Formulaire de connexion
   */
  form: FormGroup = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, this.securePasswordValidator]),
  });

  message: string = '';
  isPasswordVisible: boolean = false;

  constructor() {
  }

  /**
   * Methode qui permet de savoir l'email de l'utilisateur
   * @returns boolean
   */
  get email() {
    return this.form.get('email');
  }

  /**
   * Methode qui permet de savoir le mot de passe de l'utilisateur
   * @returns boolean
   */
  get password() {
    return this.form.get('password');
  }

  /**
   * Methode login qui est appelée lors de la soumission du formulaire
   */
  async login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials: Identite = { ...this.form.value };
    try {
      await this.authService.login(credentials);
      await this.router.navigate(['/']);
      console.log(`User connected`, this.authService.user());
      this.snackBar.open(`Bienvenue, ${this.authService.user().prenom} ${this.authService.user().nom}`, 'Fermer', {
        duration: 2000, horizontalPosition: 'left', verticalPosition: 'top'});
    } catch (error) {
      console.error(`Error while logging in`, error);
      this.snackBar.open('Connexion invalide', 'Fermer', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      });
    }
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Methode securePasswordValidator qui permet de valider le mot de passe
   * @param control
   */
  securePasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) {
      return null;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;
    const typesCount = [hasUpperCase, hasLowerCase, hasNumber, hasSymbol].filter(Boolean).length;
    if (!isValidLength || typesCount < 3) {
      return { insecurePassword: true };
    }
    return null;
  }
}
