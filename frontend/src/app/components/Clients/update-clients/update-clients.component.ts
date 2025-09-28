import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {ClientService} from '../../../services/client.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {Client} from '../../../models/Client';
import * as frLocale from 'i18n-iso-countries/langs/fr.json';
import * as countries from 'i18n-iso-countries';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-update-clients',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './update-clients.component.html',
  standalone: true,
  styleUrl: './update-clients.component.css'
})
export class UpdateClientsComponent implements OnInit {
  /**
   * Service de gestion des clients qui permet de récupérer les données des clients
   * @private
   */
  private clientService = inject(ClientService);
  /**
   * Route qui permet de récupérer les paramètres de la route
   * @private
   */
  private route = inject(ActivatedRoute);
  /**
   * FormBuilder qui permet de créer des formulaires réactifs
   * @private
   */
  private fb = inject(FormBuilder);
  /**
   * Service d'authentification qui permet de récupérer les données de l'utilisateur connecté
   * @private
   */
  private authService = inject(AuthService);
  /**
   * Service de gestion des routes qui permet de naviguer entre les différentes pages de l'application
   * @private
   */
  private router = inject(Router);

  /**
   * Formulaire de mise à jour du client
   */
  form!: FormGroup;

  /**
   * ID du client
   */
  clientId!: number;

  /**
   * Données du client
   */
  clientData!: Client;
  isLoaded = false;
  @ViewChild('paysList', { static: true }) paysListRef!: ElementRef<HTMLDataListElement>;
  protected readonly countries = countries;

  /**
   * methode ngOnInit qui est appelée lors de l'initialisation du composant
   * @returns void
   * Cette methode permet de récupérer les données du client à partir de l'ID du client
   * et de les afficher dans le formulaire
   */
  async ngOnInit() {
    console.log("onInit");
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));

    const roles = this.authService.getCurrentUserRoles();
    const currentUserId = this.authService.getCurrentUserId();

    try {
      this.clientData = (await this.clientService.getClientById(this.clientId)).data.client;
      console.log("Client recuperer" ,this.clientData);
      this.form = this.fb.group({
        nom_client: [this.clientData.nom_client, Validators.required],
        prenom_client: [this.clientData.prenom_client, Validators.required],
        email_client: [this.clientData.email_client, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
        tel_client: [this.clientData.tel_client, [Validators.required, Validators.pattern(/^\d{10}$/)]],
        nom_rue_client: [this.clientData.nom_rue_client, Validators.required],
        num_rue_client: [this.clientData.num_rue_client, Validators.required],
        code_postal_client: [this.clientData.code_postal_client, Validators.required],
        pays_client: [this.clientData.pays_client, [Validators.required, this.validCountry]],
      });
      console.log("Form initialisé avec :", this.form.value);

    } catch (error) {
      console.error('Erreur lors du chargement du client', error);
    }finally {
      this.isLoaded = true;
    }
    countries.registerLocale(frLocale);
  }

  /**
   * Methode onSubmit qui est appelée lors de la soumission du formulaire
   * @returns Promise<void>
   */
  async onSubmit() {
    if (this.form.invalid) return;

    try {
      await this.clientService.updateClient(this.clientId, this.form.value);
      this.router.navigate(['/accueil']);
    } catch (error) {
      console.error('Erreur lors de la mise à jour', error);
    }
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

  ngAfterViewInit(): void {
    const countryNamesFr = countries.getNames('fr', { select: 'official' });

    if (this.paysListRef) {
      for (const name of Object.values(countryNamesFr)) {
        const option = document.createElement('option');
        option.value = name;
        this.paysListRef.nativeElement.appendChild(option);
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
}
