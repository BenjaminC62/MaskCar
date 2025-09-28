import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import {MatStep, MatStepper, MatStepperModule, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import { MatInput} from '@angular/material/input';
import {MatLabel} from '@angular/material/form-field';
import {MatIcon} from "@angular/material/icon";
import * as countries from 'i18n-iso-countries';
import * as frLocale from 'i18n-iso-countries/langs/fr.json';
import {FactureService} from '../../services/facture.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    MatStepperModule,
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    RouterLink,
    MatStepperPrevious,
    MatStepperNext,
      MatIcon,
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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
   * Attribut pour savoir si le mot de passe est visible ou non
   */
  isPasswordVisible: boolean = false;
  /**
   * Service de gestion des factures qui permet de récupérer les données des factures
   */
  factureService = inject(FactureService);
  /**
   * SnackBar qui permet d'afficher des messages de notification
   */
  snackBar = inject(MatSnackBar);
  /**
   * Attribut pour le champ de saisie du pays
   */
  @ViewChild('paysList', { static: true }) paysListRef!: ElementRef<HTMLDataListElement>;
  /**
   * Attribut pour le champ de saisie du pays du permis
   */
  @ViewChild('paysPermisList', { static: true }) paysPermisListRef!: ElementRef<HTMLDataListElement>;
  /**
   * Attribut pour le champ de saisie du pays de la facture
   */
  @ViewChild('paysFactureList', { static: true }) paysFactureListRef!: ElementRef<HTMLDataListElement>;

  /**
   * Methode ngOnInit qui est appelée lors de l'initialisation du composant
   */
  ngOnInit(): void {
    countries.registerLocale(frLocale);
  }

  /**
   * Methode ngAfterViewInit qui est appelée après la vue du composant
   */
  ngAfterViewInit(): void {
    const countryNamesFr = countries.getNames('fr', { select: 'official' });

    for (const name of Object.values(countryNamesFr)) {
      const option = document.createElement('option');
      option.value = name;
      this.paysListRef.nativeElement.appendChild(option);
    }
    for (const name of Object.values(countryNamesFr)) {
      const option = document.createElement('option');
      option.value = name;
      this.paysPermisListRef.nativeElement.appendChild(option);
    }
    for (const name of Object.values(countryNamesFr)) {
      const option = document.createElement('option');
      option.value = name;
      this.paysFactureListRef.nativeElement.appendChild(option);
    }
  }

  /**
   * Méthode de validation personnalisée pour le pays
   * @param control
   */
  validCountry(control: AbstractControl): ValidationErrors | null {
    const selectedCountry = control.value;
    const countryNamesFr = countries.getNames('fr', { select: 'official' });
    if (selectedCountry && !Object.values(countryNamesFr).includes(selectedCountry)) {
      return { invalidCountry: true };
    }
    return null;
  }


  firstFormGroup: FormGroup = this.fb.group({
    nom_client: new FormControl('', [Validators.required]),
    prenom_client: new FormControl('', [Validators.required]),
    tel_client: new FormControl('', [Validators.required,Validators.pattern(/^\d{10}$/)]),
    email_client: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    code_postal_client: new FormControl('', [Validators.required]),
    ville_client: new FormControl('', [Validators.required]),
    pays_client: new FormControl('', [Validators.required, this.validCountry]),
    nom_rue_client: new FormControl('', [Validators.required]),
    num_rue_client: new FormControl('', [Validators.required]),
    date_naissance_client: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, this.securePasswordValidator]),
    confirm_password: new FormControl('', [Validators.required]),
  }, { validators: this.passwordsMatchValidator
  });

  secondFormGroup: FormGroup = this.fb.group({
    num_permis_client: new FormControl('',[ Validators.required]),
    date_permis_client: new FormControl('', [Validators.required]),
    pays_permis_client: new FormControl('', [Validators.required, this.validCountry]),
  });

  thirdFormGroup: FormGroup = this.fb.group({
    nom_rue_client: new FormControl('', [Validators.required]),
    num_rue_client: new FormControl('', [Validators.required]),
    code_postal_client: new FormControl('', [Validators.required]),
    ville_client: new FormControl('', [Validators.required]),
    pays_client: new FormControl('', [Validators.required, this.validCountry]),
  });

  message: string = '';

  /**
   * Méthode d'inscription qui est appelée lors de la soumission du formulaire
   */
  async register() {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid) {
      try {
        const userRequest: RegisterRequest = {
          ...this.firstFormGroup.value
        };

        console.log('userRequest', userRequest);

        const userResponse = await this.authService.register(userRequest);
        console.log('User Response:', userResponse);

        const licenseRequest = {
          id_client: userResponse.clientId,
          date_naissance_client: this.firstFormGroup.value.date_naissance_client,
          ...this.secondFormGroup.value
        };

        console.log('licenseRequest', licenseRequest);

        await this.authService.createPermisClient(licenseRequest.id_client, licenseRequest);
        console.log('License created successfully');

        const factureRequest = {
          ...this.thirdFormGroup.value,
          client_id: userResponse.clientId
        };
        console.log('clientId:', userResponse.clientId);
        console.log('Facture Request:', factureRequest);
        await this.factureService.createFacture(userResponse.clientId, factureRequest);
        console.log('Facture created successfully');

        this.message = 'Inscription réussie. Redirection...';
        await this.router.navigate(['/accueil']);
      } catch (error) {
        console.error('Erreur lors de l\'inscription', error);
        this.message = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        this.snackBar.open(this.message, 'Fermer', { duration: 3000 });
      }
    } else {
      this.markFormGroupTouched(this.firstFormGroup);
      this.markFormGroupTouched(this.secondFormGroup);
      this.markFormGroupTouched(this.thirdFormGroup);
      this.message = 'Veuillez remplir tous les champs requis.';
      this.snackBar.open(this.message, 'Fermer', { duration: 3000 });
    }
  }


  /**
   * Méthode pour afficher ou masquer le mot de passe
   */
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  /**
   * Méthode de validation du mot de passe
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

  /**
   * Méthode pour marquer tous les champs d'un FormGroup comme touchés
   * @param formGroup
   */
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Méthode pour passer à l'étape suivante du formulaire
   * @param formGroup
   */
  onNextStep(formGroup: FormGroup): void {
    if (!formGroup.valid) {
      this.markFormGroupTouched(formGroup);
    }
  }

  /**
   * Validation personnalisée pour vérifier que les mots de passe correspondent
   */
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirm_password')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
}
