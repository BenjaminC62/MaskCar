import {Component, inject, OnInit, signal} from '@angular/core';
import {Reservation} from '../../../models/Reservation';
import {ReservationService} from '../../../services/reservation.service';
import {DatePipe, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {FormsModule} from "@angular/forms";
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-liste-reservations',
  imports: [
    DatePipe,
    RouterLink,
    FormsModule,
    MatIcon,
    NgIf

  ],
  templateUrl: './liste-reservations.component.html',
  standalone: true,
  styleUrl: './liste-reservations.component.css'
})
export class ListeReservationsComponent implements OnInit{
  /**
   * Service de gestion des réservations qui permet de récupérer les données des réservations
   * @protected
   */
  protected authService = inject(AuthService);

  /**
   * Signal pour stocker les réservations
   */
  reservations = signal<Reservation[]>([]);
  /**
   * Service de gestion des réservations qui permet de récupérer les données des réservations
   * @private
   */
  private reservationService: ReservationService = inject(ReservationService);
  /**
   * Signal pour stocker les réservations filtrées
   */
  filteredReservations = signal<Reservation[]>([]);
  /**
   * Attribut pour le terme de recherche
   */
  searchTerm: string = '';
  /**
   * Attribut pour le filtre de recherche qui prend en compte le client, la voiture et la date
   * @protected
   */
  filters = {
     client_id: '',
     voiture_id: '',
     date_debut: '',
     date_fin: '',
     sort: 'debut_location',
     order: 'asc',
  };
  isLoaded = false;
  constructor() { }

  /**
   * Méthode ngOnInit qui est appelée lors de l'initialisation du composant
   */
  ngOnInit(): void {
    this.loadReservations();
    console.log("test", this.reservations());
  }

  /**
   * Méthode pour charger les réservations
   */
  async loadReservations(): Promise<void> {
    try {
      const response = await this.reservationService.getReservations(this.filters);
      this.reservations.set(response.data.reservations);
      this.filteredReservations.set(response.data.reservations);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations :', error);
    } finally {
      this.isLoaded = true;
    }
  }

  /**
   * Méthode pour trier les réservations
   */
  applyFilter(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredReservations.set(this.reservations());
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    const filtered = this.reservations().filter(reservation => {

      if (reservation.id.toString().includes(term)) {
        return true;
      }

      if (reservation.client &&
          (reservation.client.nom_client?.toLowerCase().includes(term) ||
              reservation.client.prenom_client?.toLowerCase().includes(term))) {
        return true;
      }

      return false;
    });

    this.filteredReservations.set(filtered);
  }

  /**
   * Méthode pour réinitialiser les filtres
   */
  resetFilters(): void {
    this.searchTerm = '';
    this.filteredReservations.set(this.reservations());
  }

  deleteReservation(id: number): void {
    this.reservationService.deleteReservation(id).then(() => {
      this.loadReservations();
    }).catch(error => {
      console.error('Erreur lors de la suppression de la réservation :', error);
    });
  }

}
