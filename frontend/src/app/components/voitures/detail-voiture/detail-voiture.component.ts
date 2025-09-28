import {Component, inject, OnInit} from '@angular/core';
import {VoitureService} from '../../../services/voiture.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Voiture} from '../../../models/Voiture';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-detail-voiture',
  imports: [
    NgIf
  ],
  templateUrl: './detail-voiture.component.html',
  standalone: true,
  styleUrl: './detail-voiture.component.css'
})
export class DetailVoitureComponent implements OnInit {
  /**
   * route permet de récupérer les paramètres de la route
   * @private
   */
  private route = inject(ActivatedRoute);
  /**
   * Service des voitures qui permet de récupérer les données des voitures
   * @private
   */
  private voitureService = inject(VoitureService);
  /**
   * router permet de naviguer entre les différentes pages de l'application
   * @private
   */
  private router = inject(Router);

  /**
   * Attribut pour la voiture
   */
  voitureId!: number;
  /**
   * Attribut pour les données de la voiture
   */
  voitureData?: Voiture;
  isLoaded = false;

  /**
   * Méthode ngOnInit qui est appelée lors de l'initialisation du composant
   */
  ngOnInit(): void {
    this.loadVoitureDetails();
  }

  /**
   * Méthode pour charger les détails de la voiture
   * @private
   */
  private async loadVoitureDetails() {
    console.log('Chargement des détails de la voiture...');
    this.voitureId = Number(this.route.snapshot.paramMap.get('id'));

    try {
      const res = await this.voitureService.getVoitureById(this.voitureId);
      console.log('Réponse de la voiture:', res.data);
      this.voitureData = res.data;
      console.log('Détails de la voiture:', this.voitureData);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la voiture', error);
    }finally {
      this.isLoaded = true;
    }
  }
}
