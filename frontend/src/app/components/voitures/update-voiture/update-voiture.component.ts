import {Component, inject, OnInit} from '@angular/core';
import {VoitureService} from '../../../services/voiture.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Voiture} from '../../../models/Voiture';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-update-voiture',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './update-voiture.component.html',
  standalone: true,
  styleUrl: './update-voiture.component.css'
})
export class UpdateVoitureComponent implements OnInit {
  /**
   * Constructeur de la classe UpdateVoitureComponent
   */
  constructor() {
    this.form = this.fb.group({
      etat: ['', Validators.required],
      kilometrage: ['', Validators.required],
    });
  }

  /**
   * Service de gestion des voitures
   * @private
   */
  private voitureService = inject(VoitureService);
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
   * Router qui permet de naviguer entre les différentes pages de l'application
   * @private
   */
  private router = inject(Router);

  /**
   * Attribut pour le formulaire de mise à jour de la voiture
   */
  form!: FormGroup;
  /**
   * Attribut pour l'id de la voiture
   */
  voitureId!: number;
  /**
   * Attribut pour les données de la voiture
   */
  voitureData!: Voiture;

  /**
   * Méthode ngOnInit qui est appelée lors de l'initialisation du composant
   */
  ngOnInit(): void {
    this.voitureId = Number(this.route.snapshot.paramMap.get('id'));

    this.voitureService.getVoitureById(this.voitureId).then(response => {
      this.voitureData = response.data;
      console.log("Voiture recuperer", this.voitureData);

      this.form.patchValue({
        etat: this.voitureData.etat,
        kilometrage: this.voitureData.kilometrage,
      });
    }).catch(error => {
      console.error('Erreur lors du chargement de la voiture', error);
    });
  }

  /**
   * Methode onSubmit qui est appelée lors de la soumission du formulaire
   * Cette méthode permet de mettre à jour les informations de la voiture
   */
  async onSubmit() {
    this.voitureId = Number(this.route.snapshot.paramMap.get('id'));

    try {
      this.voitureData = (await this.voitureService.getVoitureById(this.voitureId)).data;
      console.log("Voiture recuperer", this.voitureData);

      const updatedVoiture: Voiture = {
        ...this.voitureData,
        etat: this.form.value.etat,
        kilometrage: this.form.value.kilometrage,
      };

      await this.voitureService.updateVoiture(this.voitureId, updatedVoiture);
      console.log("Voiture mise à jour avec succès");
      await this.router.navigate(['/listeVoituresAgence', this.voitureData.agence.id]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la voiture', error);
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


