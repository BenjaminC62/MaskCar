import {Component, inject, OnInit, signal} from '@angular/core';
import {Client, GetResponseClient} from '../../../models/Client';
import {ClientService} from '../../../services/client.service';
import {RouterLink} from '@angular/router';
import {Agence} from '../../../models/Agence';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-liste-clients',
  imports: [
    RouterLink,
    FormsModule,
    NgIf
  ],
  templateUrl: './liste-clients.component.html',
  standalone: true,
  styleUrl: './liste-clients.component.css'
})
export class ListeClientsComponent implements OnInit {

  /**
   * Signal pour la liste des clients
   */
  clients = signal<Client[]>([]);
  /**
   * Service pour la gestion des clients qui permet de récupérer les données des clients
   * @private
   */
  private clientService: ClientService = inject(ClientService);

  /**
   * Filtres de recherche pour les clients avec les champs suivants :
   * - nom
   * - prenom
   * - email
   * - telephone
   * - sort
   * - order
   * @private
   */
  filters = {
    nom_client: '',
    prenom_client: '',
    email_client: '',
    ville_client: '',
    code_postal_client: '',
    pays_client: '',
  };
  sortColumn: keyof Client | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoaded = false;
  constructor() {}

  /**
   * Methode ngOnInit qui est appelée lors de l'initialisation du composant
   * @returns void
   */

  ngOnInit(): void {
    this.loadClients();
  }

  /**
   * Methode pour charger les clients
   * @returns Promise<void>
   */
  async loadClients(): Promise<void> {
    try {
      const response = await this.clientService.getClients(this.filters);
      const filtered = response.data.clients.filter((client: Client) => {
        const matchNom = client.nom_client.toLowerCase().includes(this.filters.nom_client.toLowerCase());
        const matchPrenom = client.prenom_client.toLowerCase().includes(this.filters.prenom_client.toLowerCase());
        const matchEmail = client.email_client.toLowerCase().includes(this.filters.email_client.toLowerCase());
        return matchNom && matchPrenom && matchEmail;
      });
      const sorted = [...filtered].sort((a, b) => {
        if (!this.sortColumn) return 0;

        const valA = a[this.sortColumn];
        const valB = b[this.sortColumn];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return this.sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        const strA = valA?.toString().toLowerCase() || '';
        const strB = valB?.toString().toLowerCase() || '';
        return this.sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });

      this.clients.set(sorted);
    } catch (error) {
      console.error('Erreur lors du chargement des clients :', error);
    } finally {
      this.isLoaded = true;
    }
  }

  sortBy(column: keyof Client): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const sorted = [...this.clients()].sort((a, b) => {
      let valA: any = a[column];
      let valB: any = b[column];

      if (column === 'ville_client' || column === 'pays_client') {
        valA = valA?.toLowerCase() || '';
        valB = valB?.toLowerCase() || '';
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    this.clients.set(sorted);
  }
  resetFilters() {
    this.filters = {
      nom_client: '',
      prenom_client: '',
      email_client: '',
      ville_client: '',
      code_postal_client: '',
      pays_client: '',
    };
    this.loadClients();
  }
}
