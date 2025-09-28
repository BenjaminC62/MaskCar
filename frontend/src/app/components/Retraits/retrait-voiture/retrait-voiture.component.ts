import {Component, inject, OnInit} from '@angular/core';
import {GetResponseReservationById} from '../../../models/Reservation';
import {ReservationService} from '../../../services/reservation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RetraitService} from '../../../services/retrait.service';
import {MatStep, MatStepper, MatStepperModule, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {join} from '@angular/compiler-cli';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {CommonModule, NgClass, NgIf} from '@angular/common';
import {MatOption} from '@angular/material/core';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {VoitureService} from "../../../services/voiture.service";
import {GetResponseVoiture, Voiture} from "../../../models/Voiture";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatProgressSpinner, MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Options} from '../../../models/Options';
import {OptionService} from '../../../services/option.service';

@Component({
  selector: 'app-retrait-voiture',
  imports: [
    MatStepper,
    MatStep,
    MatStepperNext,
    MatFormField,
    MatLabel,
    MatInput,
    MatFormField,
    FormsModule,
    MatStepperPrevious,
    ReactiveFormsModule,
    NgIf,
    MatSelect,
    MatOption,
    MatOption,
    CommonModule,
    FormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './retrait-voiture.component.html',
  standalone: true,
  styleUrl: './retrait-voiture.component.css'
})
export class RetraitVoitureComponent implements OnInit{
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
   * Constructeur de la classe RetraitVoitureComponent
   * @constructor
   */
  constructor() {
    this.retraitForm = this.fb.group({
      kilometrage: ['', Validators.required],
      niveau_essence: ['', Validators.required],
      etat_interieur: ['', Validators.required],
      etat_exterieur: ['', Validators.required],
      commentaire: [''],
      date_retrait: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  // services
  private route = inject(ActivatedRoute);
  private reservationService = inject(ReservationService);
  private fb = inject(FormBuilder);
  private retraitService = inject(RetraitService);
  private router = inject(Router);
  private voitureService = inject(VoitureService);
  private optionService = inject(OptionService);



  reservation!: GetResponseReservationById;
  retraitForm!: FormGroup;
  selectionForm!: FormGroup;
  voituresDisponibles!: GetResponseVoiture;
  voitureSelectionnee?: Voiture;
  options: Options[] = [];

  /**
   * Méthode ngOnInit qui est appelée lors de l'initialisation du composant
   * Cette methode fait appel au service de réservation pour récupérer la réservation
   */
  ngOnInit() {

    const id = this.route.snapshot.params['id'];
    this.reservationService.getReservationById(id).then(res => {
      console.log('Réservation récupérée :', res);
      this.reservation = res;

      this.loadOptions();

      const agenceId = this.reservation.data.reservation.agence.id;

      if (!agenceId) {
        console.error("Aucune agence trouvée dans la réservation");
        return;
      }

      this.voitureService.loadVoituresByAgence(agenceId).then(voitures => {
        console.log('Voitures disponibles :', voitures);
        this.voituresDisponibles = voitures;

        this.selectionForm = this.fb.group({
          voiture: [null, Validators.required]
        });
      });



      this.retraitForm = this.fb.group({
        kilometrage: ['', Validators.required],
        niveau_essence: ['', Validators.required],
        etat_interieur: ['', Validators.required],
        etat_exterieur: ['', Validators.required],
        commentaire: ['' , Validators.required],
        date_retrait: [new Date().toISOString().split('T')[0], Validators.required]
      });
    });


  }

  /**
   * Methode soumettant le formulaire de retrait
   */
  async soumettreRetrait() {
    const data = this.retraitForm.value;
    data.voiture_id = this.voitureSelectionnee?.id;



    await this.retraitService.createRetrait(this.reservation.data.reservation.id, data);
    //alert("Retrait enregistré !");
    this.router.navigate(['/listeReservation']);
  }

  /**
   * Methode pour selectionner une voiture
   * @param voiture
   */
  selectionnerVoiture(voiture: Voiture) {
    this.voitureSelectionnee = voiture;
    console.log("Voiture sélectionnée :", this.voitureSelectionnee);
  }


  async loadOptions() {
    for (let i = 0; i < this.reservation.data.reservation.liste_location.length; i++) {
      let response = await this.optionService.getOptionById(this.reservation.data.reservation.liste_location[i].id);
      this.options.push(response.data);
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

  /**
   * Méthode pour passer à l'étape suivante du formulaire
   * @param formGroup
   */
  onNextStep(formGroup: FormGroup): void {
    if (!formGroup.valid) {
      this.markFormGroupTouched(formGroup);
    }
  }
}
