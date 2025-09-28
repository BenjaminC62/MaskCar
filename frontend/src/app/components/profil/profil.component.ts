import {Component, inject, OnInit} from '@angular/core';
import { Client } from '../../models/Client';
import { Permis } from '../../models/Permis';
import { Facturation } from '../../models/Facturation';
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';
import { ReservationService } from '../../services/reservation.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {Reservation} from '../../models/Reservation';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    NgIf
  ],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  /**
   * Attributs pour le profil de l'utilisateur
   */
  user: any;
  /**
   * Attributs pour le client
   */
  client?: Client;
  /**
   * Attributs pour le permis
   */
  permis?: Permis;
  /**
   * Attributs pour la facturation
   */
  facturation?: Facturation;
  /**
   * Attributs pour les réservations
   */
  reservations: Reservation[] = [];
  /**
   * Attribut pour savoir si l'utilisateur est un client
   */
  isClient: boolean = false;

  reservationService = inject(ReservationService);
  private router = inject(Router);
  isLoaded = false;

  /**
   * Constructeur du composant Profil
   * @param authService
   * @param clientService
   */
  constructor(
    private authService: AuthService,
    private clientService: ClientService,
  ) {}

  /**
   * Méthode ngOnInit qui est appelée lors de l'initialisation du composant
   * Elle permet de récupérer les données de l'utilisateur connecté et de charger les informations spécifiques au client
   * @returns void
   */
  async ngOnInit() {
    try {
      // On récupère l'utilisateur via la méthode `me`
      this.user = await this.authService.user();
      console.log('Utilisateur connecté :', this.user);

      if (this.user?.role === 'client') {
        console.log('C\'est un client !');
        this.isClient = true;

        const clientRes = await this.clientService.getClientByUserId(this.user.id);
        this.client = clientRes.data?.client;

        const clientId = this.client?.id;

        // Récupère les informations du client (permis, facturation, etc.)
        try {
          const permisRes = await this.clientService.getPermisByClientId(clientId);
          this.permis = permisRes.data.permis;
        }
        catch (error) {
          console.error('Erreur lors de la récupération des informations du client');
        }

        const facturationRes = await this.clientService.getFacturationByClientId(clientId);
        this.facturation = facturationRes.data.facture;

        const reservationsRes = await this.reservationService.getReservationsByClientId(clientId);
        this.reservations = reservationsRes.data.reservations;


      } else if (this.user?.role === 'admin') {
        console.log('C\'est un admin !');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil :', error);
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
