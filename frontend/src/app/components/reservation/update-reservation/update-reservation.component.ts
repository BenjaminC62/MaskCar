import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ReservationService} from '../../../services/reservation.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Reservation} from '../../../models/Reservation';
import {Agence} from '../../../models/Agence';
import {Garantie} from '../../../models/Garantie';
import {Options} from '../../../models/Options';
import {Categorie} from '../../../models/Categorie';
import {MatOption} from '@angular/material/core';
import {MatFormField, MatLabel, MatSelect} from '@angular/material/select';
import {AuthService} from '../../../services/auth.service';
import {CategorieService} from '../../../services/categorie.service';
import {AgenceService} from '../../../services/agence.service';
import {GarantieService} from '../../../services/garantie.service';
import {OptionService} from '../../../services/option.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-update-reservation',
  imports: [
    ReactiveFormsModule,
    MatOption,
    MatSelect,
    MatFormField,
    NgIf
  ],
  templateUrl: './update-reservation.component.html',
  standalone: true,
  styleUrl: './update-reservation.component.css'
})
export class UpdateReservationComponent implements OnInit {

  /**
   * Service d'authentification qui permet de récupérer les données de l'utilisateur connecté
   * @private
   */
  private reservationService = inject(ReservationService);
  /**
   * Route qui permet de récupérer les paramètres de la route
   */
  private route = inject(ActivatedRoute);
  /**
   * FormBuilder qui permet de créer des formulaires réactifs
   * @private
   */
  private fb = inject(FormBuilder);
  /**
   * Router qui permet de naviguer entre les différentes pages de l'application
   * @private
   */
  private router = inject(Router);
  /**
   * Attribut pour le formulaire de réservation
   */
  form: FormGroup = this.fb.group({ });
  /**
   * Attribut qui correspond à l'id de la réservation
   */
  reservationId!: number;
  /**
   * Attribut qui correspond aux données de la réservation
   */
  reservationData!: Reservation;
  /**
   * Attribut qui permet de savoir si le formulaire est chargé
   */
  isLoaded = false;

  /**
   * Service de l'agence qui permet de récupérer les données des agences
   * @private
   */
  private agenceService = inject(AgenceService);
  /**
   * Service de garantie qui permet de récupérer les données des garanties
   * @private
   */
  private garantieService = inject(GarantieService);
  /**
   * Service de l'option qui permet de récupérer les données des options
   * @private
   */
  private optionService = inject(OptionService);
  /**
   * Service des catégories qui permet de récupérer les données des catégories
   * @private
   */
  protected categorieService = inject(CategorieService);
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
   * Méthode ngOnInit qui est appelée lors de l'initialisation du composant
   * Cette méthode est asynchrone et permet de charger les données nécessaires à l'affichage du composant
   */
  async ngOnInit() {
    this.reservationId = Number(this.route.snapshot.paramMap.get('id'));

    await Promise.all([
      this.loadCategorie(),
      this.loadAgence(),
      this.loadGarantie(),
      this.loadOptions()
    ]);

    try {
      this.reservationData = (await this.reservationService.getReservationById(this.reservationId)).data.reservation;
      console.log("Reservation recuperer", this.reservationData);

      this.form = this.fb.group({
        debut_location: [this.formatDate(this.reservationData.debut_location), Validators.required],
        fin_location: [this.formatDate(this.reservationData.fin_location), Validators.required],
        agence: [this.agence().find(a => a.id === this.reservationData.agence.id), Validators.required],
        options: [this.reservationData.liste_location.map(opt => this.options().find(o => o.id === opt.id)), Validators.required],
        garantie: [this.garantie().find(g => g.id === this.reservationData.garantie.id), Validators.required],
        categorie: [this.categorie().find(c => c.id === this.reservationData.categorie.id), Validators.required],
      });


      this.isLoaded = true;
    } catch (error) {
      console.error('Erreur lors du chargement de la réservation', error);
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  }


  /**
   * Méthode qui permet de soumettre le formulaire de réservation
   * Cette méthode est asynchrone et permet de mettre à jour la réservation
   */
  async onSubmit() {
    if(this.form.invalid) return;
    try {
      console.log("Formulaire soumis", this.form.value);
      const formData = {
        id: this.reservationId,
        liste_location: this.form.value.options.map((option: { id: number }) => ({
          id: option.id
        })),
        debut_location: this.form.value.debut_location,
        fin_location: this.form.value.fin_location,
        etat_location: this.reservationData.etat_location,
        prix_location: this.reservationData.prix_location,
        client: this.reservationData.client,
        voiture: this.reservationData.voiture,
        retrait: this.reservationData.retrait,
        garantie: this.form.value.garantie.id,
        avenant: this.reservationData.avenant,
        categorie: this.form.value.categorie.id,
        agence: this.form.value.agence.id,
        created_at: this.reservationData.created_at,
        updated_at: this.reservationData.updated_at
      }

      await this.reservationService.updateReservation(this.reservationId, formData);
      this.router.navigate(['/accueil']);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation', error);
      alert("Erreur lors de la mise à jour de la réservation");
    }
  }

  /**
   * Méthode qui permet de charger les catégories
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
   * Méthode qui permet de charger les agences
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
   * Méthode qui permet de charger les garanties
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
   * Méthode qui permet de charger les options
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
}
