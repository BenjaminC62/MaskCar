import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {
  CreateReservation,
  GetResponseReservation,
  GetResponseReservationById,
  Reservation
} from '../models/Reservation';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  /**
   * URL de l'API
   * @private
   */
  private url = 'http://localhost:8000/api/reservations';
  /**
   * Service HttpClient pour faire des requêtes HTTP
   * @private
   */
  private httpClient = inject(HttpClient);
  /**
   * Attribut httpOptions pour les requêtes HTTP
   * @private
   */
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'}),
    params: new HttpParams()
  };

  constructor() { }

  /**
   * Methode getReservations pour récupérer la liste des réservations
   * @param filters
   */
  async getReservations (filters: any = {}): Promise<GetResponseReservation> {
    this.httpOptions.params = new HttpParams();

      if (filters.client_id) {
        this.httpOptions.params = this.httpOptions.params.append('client_id', filters.client_id);
      }

      if (filters.voiture_id) {
        this.httpOptions.params = this.httpOptions.params.append('voiture_id', filters.voiture_id);
      }

      if (filters.date_debut && filters.date_fin) {
        this.httpOptions.params = this.httpOptions.params.append('date_debut', filters.date_debut);
        this.httpOptions.params = this.httpOptions.params.append('date_fin', filters.date_fin);
      }

      const reservations$ = this.httpClient.get<GetResponseReservation>(this.url, this.httpOptions);

      const response = await firstValueFrom(reservations$);
      console.log(response);
      return response;
  }

  /**
   * Methode getReservationById pour récupérer une réservation par son id
   * @param id
   */
  async getReservationById(id: number): Promise<GetResponseReservationById> {
    const url = `${this.url}/${id}`;
    const response$ = this.httpClient.get<GetResponseReservationById>(url, this.httpOptions);
    console.log("reservation", response$);
    return await firstValueFrom(response$);
  }

  /**
   * Methode updateReservation pour mettre à jour une réservation
   * @param id
   * @param data
   */
  async updateReservation(id: number, data: Reservation): Promise<GetResponseReservationById> {
    const url = `${this.url}/${id}`;
    const response$ = this.httpClient.put<GetResponseReservationById>(url, data, this.httpOptions);
    return await firstValueFrom(response$);
  }

  /**
   * methode createReservation pour créer une réservation
   * @param data
   */
  async createReservation(data: CreateReservation): Promise<CreateReservation> {
    const response$ = this.httpClient.post<CreateReservation>(this.url, data.data.reservation, this.httpOptions);
    return await firstValueFrom(response$);
  }

  /**
   * Méthode getReservationsByClientId pour récupérer les réservations par client id
   * @param clientId
   */
  async getReservationsByClientId(clientId: number): Promise<{ data: { reservations: any[] } }> {
    const url = `http://localhost:8000/api/reservations/client/${clientId}`;
    const response$ = this.httpClient.get<{ data: { reservations: any[] } }>(url, this.httpOptions);
    return await firstValueFrom(response$);
  }

  async deleteReservation(id: number): Promise<void> {
    const url = `${this.url}/${id}`;
    const response$ = this.httpClient.delete<void>(url, this.httpOptions);
    return await firstValueFrom(response$);
  }
}
