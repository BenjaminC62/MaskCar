import {Component, inject, OnInit, signal} from '@angular/core';
import {ReservationService} from '../../../services/reservation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RetourService} from '../../../services/retour.service';
import {GetResponseReservationById} from '../../../models/Reservation';
import {MatStep, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {VoitureService} from '../../../services/voiture.service';
import {Voiture} from '../../../models/Voiture';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {AvenantService} from '../../../services/avenant.service';
import {Options} from '../../../models/Options';
import {OptionService} from '../../../services/option.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-retour-voiture',
  imports: [
    MatStepper,
    MatStep,
    MatStepperNext,
    MatButton,
    MatButton,
    MatButton,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatStepperPrevious,
    ReactiveFormsModule,
    MatFormField,
    MatButton,
    MatButton,
    MatButton,
    MatButton,
    MatOption,
    MatSelect,
    MatSlideToggle,
    MatError,
    DatePipe
  ],
  templateUrl: './retour.component.html',
  standalone: true,
  styleUrl: './retour.component.css'
})
export class RetourComponent implements OnInit {
  /**
   * Attribut niveau_essence_values qui contient les valeurs possibles pour le niveau d'essence
   * @protected
   */
  protected readonly niveau_essence_values = [
    { value: 'Vide', viewValue: 'Vide' },
    { value: '1/4 plein', viewValue: '1/4 plein' },
    { value: '1/2 plein', viewValue: '1/2 plein' },
    { value: '3/4 plein', viewValue: '3/4 plein' },
    { value: 'Plein', viewValue: 'Plein' }
  ];
  /**
   * Attribut etat_interieur_values qui contient les valeurs possibles pour l'état intérieur
   * @protected
   */
  protected readonly etat_interieur_values = [
    { value: 'Propre', viewValue: 'Propre' },
    { value: 'Sale', viewValue: 'Sale' },
    { value: 'Abimé', viewValue: 'Abimé' }
  ];
  /**
   * Attribut etat_exterieur_values qui contient les valeurs possibles pour l'état extérieur
   * @protected
   */
  protected readonly etat_exterieur_values = [
    { value: 'Propre', viewValue: 'Propre' },
    { value: 'Sale', viewValue: 'Sale' },
    { value: 'Abimé', viewValue: 'Abimé' }
  ];
  /**
   * Route qui permet de récupérer les paramètres de la route
   * @private
   */
  // services
  private route = inject(ActivatedRoute);
  /**
   * Service de gestion des réservations qui permet de récupérer les données des réservations
   * @private
   */
  private reservationService = inject(ReservationService);
  /**
   * FormBuilder qui permet de créer des formulaires réactifs
   * @private
   */
  private fb = inject(FormBuilder);
  /**
   * Service de retour qui permet de gérer les retours de voitures
   * @private
   */
  private retourService = inject(RetourService);
  /**
   * Service de gestion des options qui permet de récupérer les données des options
   * @private
   */
  private optionService = inject(OptionService);
  /**
   * Router qui permet de naviguer entre les différentes pages de l'application
   * @private
   */
  private router = inject(Router);
  /**
   * Service de gestion des voitures qui permet de récupérer les données des voitures
   * @private
   */
  protected voitureService = inject(VoitureService);
  /**
   * Service de gestion des avenants qui permet de récupérer les données des avenants
   * @private
   */
  protected avenantService = inject(AvenantService);
  /**
   * Signal qui contient les voitures
   */
  voitureSignal = signal<Voiture[]>([]);

  /**
   * Constructeur de la classe RetourComponent
   */
  constructor() {
    this.vehiculeEtat = this.fb.group({
      etat_vehicule: ['', Validators.required],
      remarques: ['' , Validators.required]
    });

    this.retourForm = this.fb.group({
      kilometrage: ['', Validators.required],
      niveau_essence: ['', Validators.required],
      etat_interieur: ['', Validators.required],
      etat_exterieur: ['', Validators.required],
      commentaire: ['' , Validators.required],
      date_retour: [new Date().toISOString().split('T')[0], Validators.required]
    });

    this.avenantForm = this.fb.group({
      creerAvenant: [false],
      detail_penalite_avenant: [''],
      montant_a_payer_avenant: ['']
    });
  }



  reservation!: GetResponseReservationById;
  retourForm!: FormGroup;
  vehiculeEtat!: FormGroup;
  avenantForm!: FormGroup;
  options: Options[] = [];


  /**
   * Méthode qui est appelée lors de l'initialisation du composant
   */
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.reservationService.getReservationById(id).then(res => {
      this.reservation = res;

      this.avenantForm.get('creerAvenant')?.setValue(false);

      this.loadVoiture();
      this.loadOptions();
    });
  }

  /**
   * Méthode qui permet de soumettre le formulaire de retour
   * Cette méthode fait appel au service de retour pour enregistrer le retour de la voiture
   */
  async soumettreRetour() {
    const data = this.retourForm.value;
    const idReservation = this.route.snapshot.params['id'];
    await this.updateVoiture(idReservation);
    await this.retourService.createRetour(this.reservation.data.reservation.id, data);
    this.router.navigate(['/listeReservation']);
  }

  /**
   * Méthode qui permet de charger les voitures
   */
  async loadVoiture() {
    const response = await this.voitureService.getVoituresByAgenceId(this.reservation.data.reservation.id);
    this.voitureSignal.set(response);
  }

  /**
   * Methode getUniqueEtats qui permet de récupérer les états uniques des voitures
   * @param voitures
   */
  getUniqueEtats(voitures: Voiture[]): string[] {
    const etatsSet = new Set<string>();
    voitures.forEach(voiture => etatsSet.add(voiture.etat));
    return Array.from(etatsSet);
  }

  /**
   * Méthode qui permet de soumettre le formulaire d'avenant
   */
  async soumettreAvenant(){
    const data = this.avenantForm.value;
    const idReservation = this.reservation.data.reservation.id;
    if(data.creerAvenant) {
      await this.avenantService.createAvenant(data, idReservation);
      console.log("Avenant créé avec succès");
    }
    else{
      console.log("Pas d'avenant");
    }

  }

  async updateVoiture(idReservation: number) {
    const reservation = await this.reservationService.getReservationById(idReservation);
    if (reservation.data.reservation.voiture) {
      const voitureId = reservation.data.reservation.voiture.id;
      const voiture = await this.voitureService.getVoitureById(voitureId);
      const etat = this.vehiculeEtat.value.etat_vehicule;
      const kilometrage = this.retourForm.value.kilometrage;

      const formData = {
        id: voitureId,
        immatriculation: voiture.data.immatriculation,
        marque: voiture.data.marque,
        modele: voiture.data.modele,
        kilometrage: kilometrage,
        etat: etat,
        image: voiture.data.image,
        prix_jour: voiture.data.prix_jour,
        agence: voiture.data.agence,
        categorie: voiture.data.categorie,
        created_at: voiture.data.created_at,
        updated_at: voiture.data.updated_at
      }
      await this.voitureService.updateVoiture(voitureId, formData);
      console.log("Voiture mise à jour avec succès");
    }
  }

  async loadOptions() {
    for (let i = 0; i < this.reservation.data.reservation.liste_location.length; i++) {
      let response = await this.optionService.getOptionById(this.reservation.data.reservation.liste_location[i].id);
      this.options.push(response.data);
    }
  }

  toggleAvenant(): void {
    const detailCtrl = this.avenantForm.get('detail_penalite_avenant');
    const montantCtrl = this.avenantForm.get('montant_a_payer_avenant');

    if (this.avenantForm.get('creerAvenant')?.value) {
      detailCtrl?.setValidators([Validators.required]);
      montantCtrl?.setValidators([Validators.required]);
    } else {
      detailCtrl?.clearValidators();
      montantCtrl?.clearValidators();
    }

    detailCtrl?.updateValueAndValidity();
    montantCtrl?.updateValueAndValidity();
  }




}
