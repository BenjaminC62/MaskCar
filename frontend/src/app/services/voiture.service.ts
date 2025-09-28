import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {GetResponseVoiture, GetResponseVoitureById, GetResponseVoitureById2, Voiture} from '../models/Voiture';
import {firstValueFrom} from 'rxjs';
import {GetResponseReservationById, Reservation} from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {
  /**
   * Attribut http pour le service HttpClient
   * @private
   */
  private httpClient = inject(HttpClient);
  /**
   * URL de l'API
   * @private
   */
  private baseUrl = 'http://localhost:8000/api';
  /**
   * Attribut httpOptions pour les requêtes HTTP
   * @private
   */
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'})
  };

  /**
   * Methode getVoituresBYAgenceId pour récupérer la liste des voitures par agence
   * @param agenceId
   */
  async getVoituresByAgenceId(agenceId: number): Promise<Voiture[]> {
    const url = `${this.baseUrl}/voitures/agence/${agenceId}`;
    const response = await firstValueFrom(this.httpClient.get<{ data: Voiture[] }>(url));
    return response.data;
  }

  /**
   * Methode loadVoituresByAgence pour récupérer la liste des voitures par agence
   * @param agenceId
   */
  async loadVoituresByAgence(agenceId: number): Promise<GetResponseVoiture> {
    const requete$ = this.httpClient.get<GetResponseVoiture>(`${this.baseUrl}/voitures/agence/${agenceId}`, this.httpOptions);
    const response = await firstValueFrom(requete$);
    console.log(response);
    return response;
  }

  /**
   * Methode getVoitureById pour récupérer une voiture par son id
   * @param id
   */
  async getVoitureById(id: number): Promise<GetResponseVoitureById2> {
    const url = `http://localhost:8000/api/voitures/${id}`;
    const response$ = this.httpClient.get<GetResponseVoitureById2>(url, this.httpOptions);
    return await firstValueFrom(response$);
  }

  /**
   * Methode updateVoiture pour mettre à jour une voiture
   * @param id
   * @param voiture
   */
  async updateVoiture(id: number, voiture: Voiture): Promise<GetResponseVoitureById2> {
    const url = `${this.baseUrl}/voitures/${id}`;
    const response$ = this.httpClient.put<GetResponseVoitureById2>(url, voiture, this.httpOptions);
    return await firstValueFrom(response$);
  }

  async getVoituresByMarque(marque: string): Promise<Voiture[]> {
    try {
      const url = `${this.baseUrl}/voitures/marque/${marque}`;
      const response = await firstValueFrom(this.httpClient.get<{ data: Voiture[] }>(url));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des voitures par marque', error);
      throw new Error('Impossible de récupérer les voitures par marque');
    }
  }

  async getAllVoitures(): Promise<Voiture[]> {
    try {
      const url = `${this.baseUrl}/voitures`;
      const response = await firstValueFrom(this.httpClient.get<{ data: Voiture[] }>(url));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les voitures', error);
      throw new Error('Impossible de récupérer toutes les voitures');
    }
  }




}
