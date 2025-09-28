import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Agence} from '../models/Agence';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {
  /**
   * URL de l'API
   */
  private url = 'http://localhost:8000/api/agences';

  /**
   * Service HttpClient pour faire des requêtes HTTP
   * @private
   */
  private httpClient = inject(HttpClient);
  /**
   * Options HTTP pour les requêtes
   * @private
   */
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'}),
    params: new HttpParams()
  };

  constructor() { }
  /**
   * Méthode pour récupérer la liste des agences
   * @param filters - Filtres pour la recherche d'agences
   * @returns Observable de la liste des agences
   */
  async getAgences(filters: any = {}): Promise<Agence[]> {
    this.httpOptions.params = new HttpParams();

    if (filters.nom_agence) {
      this.httpOptions.params = this.httpOptions.params.append('nom_agence', filters.nom_agence);
    }

    if (filters.ville_agence) {
      this.httpOptions.params = this.httpOptions.params.append('ville_agence', filters.ville_agence);
    }

    if (filters.code_postal_agence) {
      this.httpOptions.params = this.httpOptions.params.append('code_postal_agence', filters.code_postal_agence);
    }

    const agences$ = this.httpClient.get<{ data: Agence[] }>(this.url, this.httpOptions);
    const response = await firstValueFrom(agences$);
    return response.data;
  }

}
