import {Component, ElementRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {MatStep, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {
  AbstractControl,
  FormBuilder, FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatHint, MatLabel} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {MatError, MatFormField, MatInput} from '@angular/material/input';
import {AgenceService} from '../../../services/agence.service';
import {Agence, GetResponseAgence} from '../../../models/Agence';
import {MatButton} from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle, MatDateRangeInput,
  MatDateRangePicker, MatEndDate,
  MatStartDate
} from '@angular/material/datepicker';
import {GarantieService} from '../../../services/garantie.service';
import {Garantie} from '../../../models/Garantie';
import {Options} from '../../../models/Options';
import {OptionService} from '../../../services/option.service';
import {AuthService} from '../../../services/auth.service';
import {ReservationService} from '../../../services/reservation.service';
import {OptionReservation} from '../../../models/Reservation';
import {of} from 'rxjs';
import {FactureService} from '../../../services/facture.service';
import {CategorieService} from '../../../services/categorie.service';
import {Categorie} from '../../../models/Categorie';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClientService} from '../../../services/client.service';
import * as countries from 'i18n-iso-countries';
import * as frLocale from 'i18n-iso-countries/langs/fr.json';
import {MatIcon} from '@angular/material/icon';
import {NgStyle} from '@angular/common';



@Component({
  selector: 'app-creation-reservation',
  imports: [
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatLabel,
    MatOption,
    MatStepperNext,
    MatStepperPrevious,
    MatError,
    MatIcon,
    NgStyle,
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './creation-reservation.component.html',
  standalone: true,
  styleUrl: './creation-reservation.component.css'
})
export class CreationReservationComponent implements OnInit {

  /**
   * Attribut pour le stepper
   */
  @ViewChild('stepper') stepper!: MatStepper;
  /**
   * FormBuilder qui permet de créer des formulaires réactifs
   * @private
   */
  private fb = inject(FormBuilder);
  /**
   * Service de gestion des agences qui permet de récupérer les données des agences
   * @private
   */
  private agenceService = inject(AgenceService);
  /**
   * Service de gestion des garanties qui permet de récupérer les données des garanties
   * @private
   */
  private garantieService = inject(GarantieService);
  /**
   * Service de gestion des options qui permet de récupérer les données des options
   * @private
   */
  private optionService = inject(OptionService);
  /**
   * Service de gestion des factures qui permet de récupérer les données des factures
   * @private
   */
  private factureService = inject(FactureService);
  /**
   * Service d'authentification qui permet de récupérer les données de l'utilisateur connecté
   * @private
   */
  protected authService = inject(AuthService);
  /**
   * Service de gestion des réservations qui permet de récupérer les données des réservations
   * @private
   */
  protected reservationService = inject(ReservationService);
  /**
   * Service de gestion des catégories qui permet de récupérer les données des catégories
   * @private
   */
  protected categorieService = inject(CategorieService);
  /**
   * Route qui permet de récupérer les paramètres de la route
   * @private
   */
  private router = inject(Router);
  /**
   * SnackBar qui permet d'afficher des messages de notification
   * @private
   */
  private snackBar = inject(MatSnackBar);
  isPasswordVisible: boolean = false;
  /**
   * Service de gestion des clients qui permet de récupérer les données des clients
   * @private
   */
  protected clientService = inject(ClientService);
  @ViewChild('paysList', { static: true }) paysListRef!: ElementRef<HTMLDataListElement>;
  @ViewChild('paysFactureList', { static: true }) paysFactureListRef!: ElementRef<HTMLDataListElement>;

  /**
   * Formulaire de réservation pour l'agence
   */
  agenceForm!: FormGroup;
  /**
   * Formulaire de réservation pour les dates
   */
  datesForm!: FormGroup;
  /**
   * Formulaire de réservation pour la catégorie
   */
  categorieForm!: FormGroup;
  /**
   * Formulaire de réservation pour la garantie
   */
  garantieForm!: FormGroup;
  /**
   * Formulaire de réservation pour les options
   */
  optionsForm!: FormGroup;
  /**
   * Formulaire de réservation pour l'identification
   */
  identificationForm!: FormGroup;
  /**
   * Formulaire de réservation pour la facturation
   */
  facturationForm!: FormGroup;
  isIdentified = false;

  /**
   * Signal pour les agences
   */
  agence = signal<Agence[]>([]);
  /**
   * Signal pour les garanties
   */
  garantie = signal<Garantie[]>([]);
  /**
   * Signal pour les options
   */
  options = signal<Options[]>([]);
  /**
   * Signal pour les catégories
   */
  categorie = signal<Categorie[]>([]);
  /**
   * Attribut pour savoir si la facturation est nouvelle ou non
   */
  isNewFacturation = true;


  /**
   * methode ngOnInit qui est appelée lors de l'initialisation du composant avec les methodes pour charger les agences, les garanties, les options, la facturation, les catégories et l'identification
   * @returns void
   */
  ngOnInit(): void {
    this.loadAgence();
    this.loadGarantie();
    this.loadOptions();
    this.loadFacturation();
    this.loadCategorie();
    this.loadIdentification();

    this.agenceForm = this.fb.group({
      agence: [null],
    });

    this.datesForm = this.fb.group({
      date_debut: [null],
      date_fin: [null],
    });

    this.categorieForm = this.fb.group({
      categorie: [null],
    });

    this.garantieForm = this.fb.group({
      garantie: [null],
    });

    this.optionsForm = this.fb.group({
      options: [null],
    });

    if(this.authService.isLoggedIn()) {
      this.identificationForm = new FormGroup({
        nom: new FormControl('', Validators.required),
        prenom: new FormControl('', Validators.required),
        tel: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
        code_postal: new FormControl('', Validators.required),
        ville: new FormControl('', Validators.required),
        pays: new FormControl('', [Validators.required, this.validCountry]),
        nom_rue: new FormControl('', Validators.required),
        numero_rue: new FormControl('', Validators.required),
        date_naissance: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required,  Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      });
    }else{
      this.identificationForm = new FormGroup({
        nom: new FormControl('', Validators.required),
        prenom: new FormControl('', Validators.required),
        tel: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
        code_postal: new FormControl('', Validators.required),
        ville: new FormControl('', Validators.required),
        pays: new FormControl('', [Validators.required, this.validCountry]),
        nom_rue: new FormControl('', Validators.required),
        numero_rue: new FormControl('', Validators.required),
        date_naissance: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required,  Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
        password: new FormControl('', [Validators.required, this.securePasswordValidator]),
      });
    }

    this.facturationForm = new FormGroup({
      numero_rue: new FormControl('', Validators.required),
      nom_rue: new FormControl('', Validators.required),
      code_postal: new FormControl('', Validators.required),
      ville: new FormControl('', Validators.required),
      pays: new FormControl('', [Validators.required, this.validCountry]),
    });
    countries.registerLocale(frLocale);
  }
  ngAfterViewInit(): void {
    const countryNamesFr = countries.getNames('fr', { select: 'official' });

    if (this.paysListRef) {
      for (const name of Object.values(countryNamesFr)) {
        const option = document.createElement('option');
        option.value = name;
        this.paysListRef.nativeElement.appendChild(option);
      }
    }

    if (this.paysFactureListRef) {
      for (const name of Object.values(countryNamesFr)) {
        const option = document.createElement('option');
        option.value = name;
        this.paysFactureListRef.nativeElement.appendChild(option);
      }
    }
  }
  validCountry(control: AbstractControl): ValidationErrors | null {
    const selectedCountry = control.value;
    const countryNamesFr = countries.getNames('fr', { select: 'official' });
    if (selectedCountry && !Object.values(countryNamesFr).includes(selectedCountry)) {
      return { invalidCountry: true };
    }
    return null;
  }

  /**
   * Méthode pour charger les données de facturation
   */
  async loadFacturation() {
    try {
      console.log('Loading facturation data...');
      if (this.authService.isLoggedIn()) {
        const userId = this.authService.getCurrentUserId();
        const client = await this.authService.getClientByUserID(userId);
        const clientId = client.data.client.id;

        const response = await this.factureService.getFacturation(clientId);
        console.log('Facturation data retrieved:', response);

        if (response) {
          this.isNewFacturation = false;
          this.facturationForm.patchValue({
            numero_rue: response.data.facture.num_rue_facturations,
            nom_rue: response.data.facture.nom_rue_facturations,
            code_postal: response.data.facture.code_postal_facturations,
            ville: response.data.facture.ville_facturations,
            pays: response.data.facture.pays_facturations,
          });
        }
      }
    } catch (error) {
      console.error('Error loading facturation data:', error);
      this.isNewFacturation = true;
    }
  }

  /**
   * Méthode pour charger les catégories
   */
  async loadCategorie(){
    try {
      const response = await this.categorieService.getCategories();
      console.log('Voici les categories :', response);
      this.categorie.set(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des agences :', error);
    }
  }

  /**
   * Méthode pour charger les informations d'identification
   */
  async loadIdentification() {
    if (this.authService.isLoggedIn()) {
      try {
        const userId = this.authService.getCurrentUserId();
        const client = await this.authService.getClientByUserID(userId);

        if (client && client.data && client.data.client) {
          this.identificationForm.patchValue({
            nom: client.data.client.nom_client,
            prenom: client.data.client.prenom_client,
            tel: client.data.client.tel_client,
            code_postal: client.data.client.code_postal_client,
            ville: client.data.client.ville_client,
            pays: client.data.client.pays_client,
            nom_rue: client.data.client.nom_rue_client,
            numero_rue: client.data.client.num_rue_client,
            date_naissance: client.data.client.date_naissance_client,
            email: client.data.client.email_client,
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des informations d\'identification :', error);
      }
    }
  }

  /**
   * Methode onSubmitFacturation qui est appelée lors de la soumission du formulaire de facturation
   */
  async onSubmitFacturation() {
    try {
      const userId = this.authService.getCurrentUserId();
      const client = await this.authService.getClientByUserID(userId);
      const clientId = client.data.client.id;

      const factureData = {
        num_rue_client: this.facturationForm.value.numero_rue,
        nom_rue_client: this.facturationForm.value.nom_rue,
        code_postal_client: this.facturationForm.value.code_postal,
        ville_client: this.facturationForm.value.ville,
        pays_client: this.facturationForm.value.pays,
      };

      if (this.isNewFacturation) {
        await this.factureService.createFacture(clientId, factureData);
      } else {
        await this.factureService.updateFacturation(clientId, factureData);
      }

      console.log('Facturation data saved successfully');
    } catch (error) {
      console.error('Error saving facturation data:', error);
    }
  }

  /**
   * Méthode pour charger les agences
   */
  async loadAgence(){
    try {
      const response = await this.agenceService.getAgences();
      console.log('Données récupérées :', response);
      this.agence.set(response);
    } catch (error) {
      console.error('Erreur lors du chargement des agences :', error);
    }
  }

  /**
   * Méthode pour charger les garanties
   */
  async loadGarantie(){
    try {
      const response = await this.garantieService.getGarantie();
      console.log('Voici les garanties :', response);
      this.garantie.set(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des agences :', error);
    }
  }

  /**
   * Méthode pour charger les options
   */
  async loadOptions(){
    try {
      const response = await this.optionService.getOption();
      console.log('Voici les options :', response);
      this.options.set(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des agences :', error);
    }
  }

  /**
   * Methode onRegister qui est appelée lors de l'inscription
   */
  async onRegister() {
    if (this.identificationForm.valid) {
      const email = this.identificationForm.get('email')?.value;
      const password = this.identificationForm.get('password')?.value;

      try {
        const emailExists = await this.authService.checkEmailExists(email);
        console.log('Email existe déjà ?', emailExists);

        if (emailExists) {
          try {
            await this.authService.login({ email, password });

            await this.loadFacturation();

            this.isIdentified = true;

            this.snackBar.open('Connexion réussie. Vous avez déjà un compte de créer avec cette e-mail.', 'Fermer', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          } catch (loginError) {
            console.error('Erreur lors de la connexion:', loginError);
            this.snackBar.open('Erreur de connexion. Veuillez vérifier vos identifiants.', 'Fermer', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        } else {
          const newUser = {
            email_client: email, password,
            nom_client: this.identificationForm.get('nom')?.value,
            prenom_client: this.identificationForm.get('prenom')?.value,
            tel_client: this.identificationForm.get('tel')?.value,
            date_naissance_client: this.identificationForm.get('date_naissance')?.value,
            nom_rue_client: this.identificationForm.get('nom_rue')?.value,
            num_rue_client: this.identificationForm.get('numero_rue')?.value,
            code_postal_client: this.identificationForm.get('code_postal')?.value,
            ville_client: this.identificationForm.get('ville')?.value,
            pays_client: this.identificationForm.get('pays')?.value,
          };

          await this.authService.register(newUser);
          console.log('Inscription réussie');
          this.snackBar.open('Compte créé avec succès.', 'Fermer', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      } catch (error) {
        console.error('Erreur lors de la connexion ou de l\'inscription :', error);
        this.snackBar.open('Une erreur est survenue.', 'Fermer', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    }
  }


  /**
   * Methode onSubmit qui est appelée lors de la soumission du formulaire
   */
    async onSubmit() {
    const repToken = (await this.authService.me());
    const userTokenCo = repToken;
    console.log("Token : ", userTokenCo);
    console.log(await this.authService.me());

      const userCo = this.authService.getCurrentUserId();
      console.log("USerid : ", userCo);
      const rep = await this.authService.getClientByUserID(userCo);
      const clientCo = rep;
      console.log("Client : ", clientCo);

      console.log('Formulaire de dates :', this.datesForm.value);
      console.log('Options sélectionnées :', this.optionsForm.value.options);




    const reservation = {
      liste_location: this.optionsForm.value.options.map((option : OptionReservation) => ({
        id: option.id,
      })),
      debut_location: this.datesForm.value.date_debut,
      fin_location: this.datesForm.value.date_fin,
      client_id: this.authService.isLoggedIn() ? clientCo.data.client.id : 1,
      voiture_id: null,
      retrait_id: null,
      garantie_id: this.garantieForm.value.garantie?.id,
      avenant_id: null,
      categorie_id: this.categorieForm.value.categorie?.id,
      agence_id: this.agenceForm.value.agence.id,
    }

    const data =  {
      success: true,
      data: {
        reservation: reservation,
      },
      message: 'Réservation créée avec succès',
    };

    if (this.agenceForm.invalid || this.datesForm.invalid || this.categorieForm.invalid || this.garantieForm.invalid || this.optionsForm.invalid || this.identificationForm.invalid || this.facturationForm.invalid) {
      return;
    }


    console.log('Données soumises :', data);

    try {
      const response = await this.reservationService.createReservation(data);
      console.log('Réservation créée avec succès :', response)
      this.router.navigate(['/accueil']).then(() => {
        this.snackBar.open('Réservation créée avec succès', 'Fermer', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
    } catch (error) {
      console.error('Erreur lors de la création de la réservation :', error);
    }
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }



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
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  onNextStep(formGroup: FormGroup): void {
    if (!formGroup.valid) {
      this.markFormGroupTouched(formGroup);
    }
  }

  protected readonly countries = countries;
}
