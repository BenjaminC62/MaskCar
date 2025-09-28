import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { signal, computed } from '@angular/core';
import {ANONYMOUS_USER, GetUserResponse, User} from '../models/User';
import {MatSnackBar} from "@angular/material/snack-bar";
import {GetResponsePermis} from '../models/Permis';
import {Facturation, GetResponseFacture} from '../models/Facturation';
import {GetResponseClientById} from '../models/Client';
import {Client} from '../models/Client';



export type getResponseLogin = {
  success: boolean;
  data: {
    user: {
      id: number;
      nom: string;
      prenom: string;
      email: string;
      role: string;
    };
    token: string;
    token_type: string;
  };
  message: string;
};


export type Identite = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  nom_client: string;
  prenom_client: string;
  tel_client: string;
  code_postal_client: string;
  ville_client: string;
  pays_client: string;
  nom_rue_client: string;
  num_rue_client: string;
  email_client: string;
  date_naissance_client: string;
  password: string;

};


export type GetResponseRegister = {
  success: boolean;
  data: {
    token: string;
    token_type: string;
    client: {
      id: number;
      nom_client: string;
      prenom_client: string;
      tel_client: string;
      code_postal_client: string;
      ville_client: string;
      pays_client: string;
      nom_rue_client: string;
      num_rue_client: string;
      email_client: string;
      date_naissance_client: string;
      user: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        role: string;
      }
    }
  },
  message: string;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * http permet de faire des requêtes HTTP
   */
  http = inject(HttpClient);
  /**
   * Router qui permet de naviguer entre les différentes pages de l'application
   */
  router = inject(Router);
  /**
   * url de l'API
   */
  readonly url = `${environment.apiUrl}`;

  /**
   * Options HTTP pour les requêtes
   * @private
   */
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'application/json'}),
  };
  /**
   * Signal pour gérer l'état de l'utilisateur
   * @private
   */
  readonly #userSignal = signal(ANONYMOUS_USER);
  /**
   * user est un signal qui contient les informations de l'utilisateur
   */
  user = this.#userSignal.asReadonly();
  /**
   * isLoggedIn est une propriété calculée qui indique si l'utilisateur est connecté
   */
  isLoggedIn = computed(() => this.user().id !== 0);

  /**
   * Constructeur de la classe AuthService
   * @param snackBar
   */
  constructor(private snackBar: MatSnackBar) {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    if (token && userRaw) {
      const parsedUser = JSON.parse(userRaw);
      const user = { ...parsedUser, token } as User;
      this.#userSignal.set(user);
    }
  }

  /**
   * Methode login qui permet de connecter un utilisateur
   * Cette méthode envoie une requête POST à l'API pour authentifier l'utilisateur
   * @param credential
   */
  async login(credential: Identite): Promise<User> {
    const response$ = this.http.post<getResponseLogin>(`${this.url}/login`, credential, this.httpOptions);
    const response = await firstValueFrom(response$);
    const user = <User>{ ...response.data.user, token: response.data.token };
    console.log('Rôle utilisateur après connexion:', user.role);
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.#userSignal.set(user);
    return user;
  }

  /**
   * Méthode register qui permet d'enregistrer un nouvel utilisateur
   * Cette méthode envoie une requête POST à l'API pour créer un nouvel utilisateur
   * @param request
   */
  async register(request: RegisterRequest): Promise<{ user: User, clientId: number }> {
    console.log('register', request);
    const response$ = this.http.post<GetResponseRegister>(`${this.url}/register`, request, this.httpOptions);
    console.log('response$', response$);
    const response = await firstValueFrom(response$);
    console.log(response);
    console.log(response.data.client.user);
    console.log(response.data.client);
    const user = { ...response.data.client.user, token: response.data.token} as User;
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.#userSignal.set(user);
    return {user, clientId: response.data.client.id};
  }

  /**
   * Méthode logout qui permet de déconnecter l'utilisateur
   * Cette méthode supprime le token de l'utilisateur et redirige vers la page d'accueil
   */
  async logout(): Promise<void> {
    try {
      this.#userSignal.set(ANONYMOUS_USER);
      localStorage.removeItem('token');
      await this.router.navigate(['/']);
      this.snackBar.open('Vous avez été déconnecté.', 'Fermer', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  }

  /**
   * Méthode me qui permet de récupérer les informations de l'utilisateur connecté
   * Cette méthode envoie une requête GET à l'API pour récupérer les informations de l'utilisateur
   */
  async me(): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant pour /me');
    }

    const response$ = this.http.get<GetUserResponse>(`${this.url}/me`, this.httpOptions);
    const response = await firstValueFrom(response$);

    console.log('Réponse complète de /me:', response);

    return response.data.user;
  }

  /**
   * Méthode refresh qui permet de rafraîchir le token de l'utilisateur
   * Cette méthode envoie une requête POST à l'API pour rafraîchir le token
   */
  async refresh(): Promise<User> {
    try {
      const oldToken = this.user()?.token;
      if (!oldToken) {
        throw new Error('Token manquant pour le rafraîchissement');
      }
      const response$ = this.http.post<any>(
        `${this.url}/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${oldToken}`,
          }
        }
      );
      const response = await firstValueFrom(response$);
      console.log('Réponse de rafraîchissement', response);
      const user = { ...this.user(), token: response.token } as User;
      this.#userSignal.set(user);
      localStorage.setItem('token', user.token);
      return user;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      throw error;
    }
  }
  /**
   * Méthode createPermisClient qui permet de créer un permis pour un client
   * @param idClient
   * @param permisData
   */
  async createPermisClient(idClient: number, permisData: any): Promise<GetResponsePermis> {
    console.log('createPermisClient', idClient, permisData);
    const response$ = this.http.post<GetResponsePermis>(`${this.url}/clients/${idClient}/conducteur`, permisData, this.httpOptions);
    const response = await firstValueFrom(response$);
    return response;
  }

  /**
   * Methode getCurrentUserId qui permet de récupérer l'id de l'utilisateur connecté
   */
  getCurrentUserId(): number {
    return this.#userSignal().id;
  }
  /**
   * Methode getCurrentUserName qui permet de récupérer le nom de l'utilisateur connecté
   */
  getCurrentUserNameAndFirstName() : string {
    const user = this.#userSignal();
    return `${user.prenom} ${user.nom}`;
  }

  /**
   * Methode getCurrentUserRoles qui permet de récupérer les rôles de l'utilisateur connecté
   */
  getCurrentUserRoles(): string[] {
    const user = this.#userSignal();
    return [user.role];
  }

  /**
   * Méthode getConnectUserRole qui permet de récupérer le rôle de l'utilisateur connecté
   */
  getConnectUserRole() : string {
    const user = this.#userSignal();
    return user.role;
  }

  /**
   * Méthode getClientByUserID qui permet de récupérer le client par son id
   * @param userId
   */
  async getClientByUserID(userId : number) : Promise<GetResponseClientById> {
    const response$ = this.http.get<GetResponseClientById>(`${this.url}/clients/user/${userId}`, this.httpOptions);
    const response = await firstValueFrom(response$);
    return response;
  }

  /**
   * Methode checkEmailExists qui permet de vérifier si un email existe déjà
   * @param email
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const response$ = this.http.get<{ success: boolean, data: { exists: boolean }, message: string }>(
      `${this.url}/check-email/${email}`,
      this.httpOptions
    );
    const response = await firstValueFrom(response$);
    return response.data.exists;
  }


}
