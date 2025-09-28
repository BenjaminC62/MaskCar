import {Component, inject, OnInit} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {Client, GetResponseClient, GetResponseClientById} from '../../../models/Client';
import {Permis} from '../../../models/Permis';
import {Facturation} from '../../../models/Facturation';
import {ReservationService} from '../../../services/reservation.service';
import {Reservation} from '../../../models/Reservation';
import {DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-detail-clients',
  imports: [
    RouterLink,
    DatePipe,
    NgIf
  ],
  templateUrl: './detail-clients.component.html',
  standalone: true,
  styleUrl: './detail-clients.component.css'
})
export class DetailClientsComponent implements OnInit{

  /**
   * attribut pour la route qui permet de récupérer les paramètres de la route
   * @private
   */
  private route = inject(ActivatedRoute);
  /**
   * Service de gestion des clients qui permet de récupérer les données des clients
   * @private
   */
  private clientService = inject(ClientService);
  /**
   * Service d'authentification qui permet de récupérer les données de l'utilisateur connecté
   * @private
   */
  private authService = inject(AuthService);
  /**
   * Service de gestion des réservations qui permet de récupérer les données des réservations
   * @private
   */
  private reservationService = inject(ReservationService);
  /**
   * Service de gestion des routes qui permet de naviguer entre les différentes pages de l'application
   * @private
   */
  private router = inject(Router);

  /**
   * ID du client
   */
  clientId!: number;
  /**
   * Données potentielles du client
   */
  clientData?: Client;
  /**
   * Permis du client , s'il existe
   */
  permis?: Permis;
  /**
   * Facturation du client , si elle existe
   */
  facturation?: Facturation;
  /**
   * Liste des réservations du client
   */
  reservations: Reservation[] = [];
  isLoaded = false;

  /**
   * methode ngOnInit qui est appelée lors de l'initialisation du composant
   */
  ngOnInit(): void {
    this.loadClientDetails();
  }

  /**
   * Methode pour charger les détails du client
   * et vérifier si l'utilisateur a le droit d'accéder à cette page (admin ou client connecté)
   * @returns Promise<void>
   */
  private async loadClientDetails() {
    const roles = this.authService.getCurrentUserRoles();
    const currentUserId = this.authService.getCurrentUserId();
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));

    if (!roles.includes('admin') && currentUserId !== this.clientId) {
      this.router.navigate(['/unauthorized']);
      return;
    }

    try {
      const res = await this.clientService.getClientById(this.clientId);
      this.clientData = res.data.client;

      try {
        const permisRes = await this.clientService.getPermisByClientId(this.clientId);
        this.permis = permisRes.data.permis;
      }
      catch (error) {
        console.error('Erreur lors de la récupération du permis');
      }

      const facturationRes = await this.clientService.getFacturationByClientId(this.clientId);
      this.facturation = facturationRes.data.facture;

      console.log(this.facturation)

      const reservationsRes = await this.reservationService.getReservationsByClientId(this.clientId);
      this.reservations = reservationsRes.data.reservations;

    } catch (error) {
      console.error('Erreur lors de la récupération des détails client', error);
    }finally {
      this.isLoaded = true;
    }
  }

  deleteReservation(reservationId: number) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.reservationService.deleteReservation(reservationId)
      this.router.navigate(['/accueil']);
    }
  }
}
