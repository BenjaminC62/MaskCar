import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {GetResponseGarantie} from '../models/Garantie';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GarantieService {
  /**
   * URL de l'API
   * @private
   */
  private url = 'http://localhost:8000/api/garanties';
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
   * Methode getGarantie pour récupérer la liste des garanties
   */
  async getGarantie(): Promise<GetResponseGarantie> {
    const garanties$ = this.httpClient.get<GetResponseGarantie>(this.url, this.httpOptions);
    const response = await firstValueFrom(garanties$);
    console.log(response);
    return response;
  }
}
