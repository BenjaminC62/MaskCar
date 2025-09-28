import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {GetResponseOptions, GetResponseOptionsById} from '../models/Options';

@Injectable({
  providedIn: 'root'
})
export class OptionService {
  /**
   * URL de l'API
   * @private
   */
  private url = 'http://localhost:8000/api/options';
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
   * Methode getOption pour récupérer la liste des options
   */
  async getOption(): Promise<GetResponseOptions> {
        const options$ = this.httpClient.get<GetResponseOptions>(this.url, this.httpOptions);
        const response = await firstValueFrom(options$);
        console.log(response);
        return response;
    }

  /**
   * Methode getOptionById pour récupérer une option par son id
   * @param id
   */
  async getOptionById(id: number): Promise<GetResponseOptionsById> {
        const options$ = this.httpClient.get<GetResponseOptionsById>(`${this.url}/${id}`, this.httpOptions);
        const response = await firstValueFrom(options$);
        console.log(response);
        return response;
    }
}
