import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {GetResponseReservationById} from '../models/Reservation';
import {GetResponseRetrait, GetResponseRetraitById} from '../models/Retrait';

@Injectable({
  providedIn: 'root'
})
export class RetraitService {
  /**
   * Attribut http pour le service HttpClient
   * @private
   */
  private http = inject(HttpClient);
  /**
   * URL de l'API
   * @private
   */
  private url = 'http://localhost:8000/api/reservations';
  /**
   * Attribut httpOptions pour les requêtes HTTP
   * @private
   */
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'})
  };

  /**
   * Méthode pour créer un retrait
   * @param idLocation
   * @param data
   */
  async createRetrait(idLocation: number, data: any): Promise<GetResponseRetraitById> {
    const requete$ = this.http.post<GetResponseRetraitById>(`${this.url}/${idLocation}/retrait`, data, this.httpOptions);
    const response = await firstValueFrom(requete$);
    console.log(response);
    return response;
  }
}
