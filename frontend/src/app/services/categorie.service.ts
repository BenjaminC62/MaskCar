import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {GetResponseCategorie} from '../models/Categorie';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  /**
   * URL de l'API
   * @private
   */
  private url = 'http://127.0.0.1:8000/api/categories';
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
   * Methode getCategories pour récupérer la liste des catégories
   * @param filters
   */
  async getCategories(filters: any = {}): Promise<GetResponseCategorie> {
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

    const categories$ = this.httpClient.get<GetResponseCategorie>(this.url, this.httpOptions);
    const response = await firstValueFrom(categories$);
    console.log(response);
    return response;

  }
}
