import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Facturation, GetResponseFacture } from '../models/Facturation';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FactureService {
  /**
   * Attribut http pour le service HttpClient
   */
  http = inject(HttpClient);
  /**
   * Router pour la navigation
   */
  router = inject(Router);
  /**
   * URL de l'API
   * @private
   */
  readonly url = `${environment.apiUrl}`;
  /**
   * Options HTTP pour les requêtes
   * @private
   */
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
  };

  constructor() {}

  /**
   * Methode pour créer une facture
   * @param idClient
   * @param factureData
   */
  async createFacture(idClient: number, factureData: any): Promise<GetResponseFacture> {
    console.log('createFacture', idClient, factureData);
    const response$ = this.http.post<GetResponseFacture>(`${this.url}/clients/${idClient}/facturation`, factureData, this.httpOptions);
    const response = await firstValueFrom(response$);
    return response;
  }

  /**
   * Méthode pour récupérer la liste des factures d'un client
   * @param idClient
   */
  async getFacturation(idClient: number): Promise<GetResponseFacture> {
    const response$ = this.http.get<GetResponseFacture>(`${this.url}/clients/${idClient}/facturation`, this.httpOptions);
    return await firstValueFrom(response$);
  }

  /**
   * Methode pour update une facture
   * @param idClient
   * @param factureData
   */
  async updateFacturation(idClient: number, factureData: any): Promise<GetResponseFacture> {
    const response$ = this.http.put<GetResponseFacture>(`${this.url}/clients/${idClient}/facturation`, factureData, this.httpOptions);
    return await firstValueFrom(response$);
  }

}
