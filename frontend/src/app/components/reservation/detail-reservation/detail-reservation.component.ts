import {Component, inject, OnInit, signal} from '@angular/core';
import {ReservationService} from '../../../services/reservation.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {Reservation} from '../../../models/Reservation';
import {CommonModule, CurrencyPipe, DatePipe} from '@angular/common';
import {Client} from '../../../models/Client';
import {ClientService} from '../../../services/client.service';
import {Options} from '../../../models/Options';
import {OptionService} from '../../../services/option.service';

@Component({
  selector: 'app-detail-reservation',
  imports: [
    DatePipe,
    CurrencyPipe,
    RouterLink,
    CommonModule
  ],
  templateUrl: './detail-reservation.component.html',
  standalone: true,
  styleUrl: './detail-reservation.component.css'
})
export class DetailReservationComponent implements OnInit{
  /**
   * Service de gestion des réservations qui permet de récupérer les données des réservations
   * @private
   */
  private reservationService = inject(ReservationService);
  /**
   * Service de gestion des options qui permet de récupérer les données des options
   * @private
   */
  private optionService = inject(OptionService);
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
   * Attributs pour la réservation
   */
  reservation!: Reservation;
  /**
   * Attributs pour le client
   */
  client!: Client | null;
  /**
   * Attributs pour l'id de la réservation
   */
  reservationId!: number;
  /**
   * Attributs pour les options
   */
  options : Options[] = [];

  isLoaded = false;

  /**
   * Propriété pour stocker les informations du bouton de retour
   */
  returnButton: { link: string; text: string } = { link: '', text: '' };

  constructor() { }

  /**
   * Méthode ngOnInit qui est appelée lors de l'initialisation du composant
   * Elle permet de récupérer les données de l'utilisateur connecté et de charger les informations spécifiques au client
   */
  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadReservation();
    this.setReturnButton();
  }

  /**
   * Méthode qui permet de récupérer les détails de la réservation
   */
  async loadReservation(): Promise<void> {
    try {
      const res$ = await this.reservationService.getReservationById(this.reservationId);
      this.reservation = res$.data.reservation;

      for (let i = 0; i < this.reservation.liste_location.length; i++) {
        let response = await this.optionService.getOptionById(this.reservation.liste_location[i].id);
        this.options.push(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la réservation', error);
    }finally {
      this.isLoaded = true;
    }
  }

  setReturnButton(): void {
    const userRole = this.authService.getConnectUserRole();
    if (userRole === 'admin') {
      this.returnButton = {
        link: '/listeReservation',
        text: 'Retour à la liste des réservations'
      };
    } else if (userRole === 'client') {
      this.returnButton = {
        link: '/accueil',
        text: 'Retour à l\'accueil'
      };
    }
  }

}
