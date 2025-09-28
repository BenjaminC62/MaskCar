import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Client, GetResponseClient, GetResponseClientById} from '../models/Client';
import {firstValueFrom} from 'rxjs';
import {AuthService} from './auth.service';
import { Permis } from '../models/Permis';
import {Facturation} from '../models/Facturation';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  /**
   * URL de l'API
   * @private
   */
  private url = 'http://localhost:8000/api/clients';
  /**
   * Service HttpClient pour faire des requêtes HTTP
   * @private
   */
  private httpClient = inject(HttpClient);
  /**
   * Service AuthService pour gérer l'authentification
   * @private
   */
  private authService = inject(AuthService);
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
   * Methode getClients pour récupérer la liste des clients
   * @param filters
   */
  async getClients(filters: any = {}): Promise<GetResponseClient> {
    this.httpOptions.params = new HttpParams();

    if (filters.nom) {
      this.httpOptions.params = this.httpOptions.params.append('nom', filters.nom);
    }

    if (filters.prenom) {
      this.httpOptions.params = this.httpOptions.params.append('prenom', filters.prenom);
    }

    if (filters.email) {
      this.httpOptions.params = this.httpOptions.params.append('email', filters.email);
    }

    if (filters.telephone) {
      this.httpOptions.params = this.httpOptions.params.append('telephone', filters.telephone);
    }

    if (filters.sort) {
      this.httpOptions.params = this.httpOptions.params.append('sort', filters.sort);
    }

    if (filters.order) {
      this.httpOptions.params = this.httpOptions.params.append('order', filters.order);
    }

    const token = localStorage.getItem('token');
    if (token) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    }

    const clients$ = this.httpClient.get<GetResponseClient>(this.url, this.httpOptions);

    const response = await firstValueFrom(clients$);
    console.log(response);
    return response;
  }

  /**
   * Methode getCLientById pour récupérer un client par son id
   * @param id
   */
  async getClientById(id: number): Promise<GetResponseClientById> {
    const url = `${this.url}/${id}`;
    const response$ = this.httpClient.get<GetResponseClientById>(url, this.httpOptions);
    return await firstValueFrom(response$);
  }

  /**
   * Méthode getClientByUserId pour récupérer un client par son id utilisateur
   * @param id
   */
  async getClientByUserId(id: number): Promise<GetResponseClientById> {
    const url = `${this.url}/user/${id}`;
    const response$ = this.httpClient.get<GetResponseClientById>(url, this.httpOptions);
    return await firstValueFrom(response$);
  }

  /**
   * Methode updateClient pour mettre à jour un client
   * @param id
   * @param clientData
   */
  async updateClient(id: number, clientData: Partial<GetResponseClientById>): Promise<void> {
    const url = `${this.url}/${id}`;
    const response$ = this.httpClient.put<void>(url, clientData, this.httpOptions);
    return await firstValueFrom(response$);
  }

  /**
   * Methode getPermisByClientId pour récupérer le permis d'un client par son id
   * @param clientId
   */
  async getPermisByClientId(clientId: number): Promise<{ data: { permis: Permis } }> {
    const url = `${this.url}/${clientId}/permis`;
    const response$ = this.httpClient.get<{ data: { permis: Permis } }>(url, this.httpOptions);
    return await firstValueFrom(response$);
  }

  /**
   * Methode getFacturationByClientId pour récupérer la facturation d'un client par son id
   * @param clientId
   */
  async getFacturationByClientId(clientId: number): Promise<{ data: { facture: Facturation } }> {
    const url = `${this.url}/${clientId}/facturation`;
    const response$ = this.httpClient.get<{ data: { facture: Facturation } }>(url, this.httpOptions);
    return await firstValueFrom(response$);
  }

}
