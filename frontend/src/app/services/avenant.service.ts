import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Avenant, GetResponseAvenant} from '../models/Avenant';
import {firstValueFrom} from 'rxjs';
import {CreateReservation} from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class AvenantService {
  /**
   * URL de l'API
   */
  private url = 'http://127.0.0.1:8000/api/reservations/avenant';
  /**
   * Attribut pour le service HttpClient
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
   * Méthode pour créer un avenant
   * @param avenant
   * @param idReservation
   */
  async createAvenant(avenant: CreateReservation,  idReservation : number): Promise<CreateReservation> {
    const payload = { ...avenant, idReservation };
    console.log(payload)
    const requete = this.httpClient.post<CreateReservation>(this.url, payload, this.httpOptions);
    const response = await firstValueFrom(requete);
    console.log(response);
    return response;
  }
}
