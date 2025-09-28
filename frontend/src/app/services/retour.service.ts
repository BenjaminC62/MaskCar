import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GetResponseRetourById} from '../models/Retour';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RetourService {
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
   * Méthode pour créer un retour
   * @param idLocation
   * @param data
   */
  async createRetour(idLocation: number, data:any): Promise<GetResponseRetourById> {
    const requete$ = this.http.post<GetResponseRetourById>(`${this.url}/${idLocation}/retour`, data, this.httpOptions);
    const response = await firstValueFrom(requete$);
    console.log(response);
    return response;
  }

}
