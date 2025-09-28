import { Component, inject, OnInit, signal } from '@angular/core';
import { Agence } from '../../../models/Agence';
import { AgenceService } from '../../../services/agence.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-liste-agence',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './liste-agence.component.html',
  styleUrl: './liste-agence.component.css'
})
export class ListeAgenceComponent implements OnInit {
  agences = signal<Agence[]>([]);
  private agenceService = inject(AgenceService);
  isLoaded = false;

  filters = {
    nom_agence: '',
    ville_agence: '',
    code_postal_agence: '',
  };

  sortColumn: keyof Agence | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.loadAgences();
  }

  async loadAgences(): Promise<void> {
    try {
      const response = await this.agenceService.getAgences({});
      const filtered = response.filter(agence => {
        const matchNom = agence.nom_agence.toLowerCase().includes(this.filters.nom_agence.toLowerCase());
        const matchVille = agence.ville_agence.toLowerCase().includes(this.filters.ville_agence.toLowerCase());
        const matchCodePostal = agence.code_postal_agence.toString().includes(this.filters.code_postal_agence);
        return matchNom && matchVille && matchCodePostal;
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

      this.agences.set(sorted);
    } catch (error) {
      console.error('Erreur lors du chargement des agences :', error);
    }finally {
      this.isLoaded = true;
    }
  }

  sortBy(column: keyof Agence): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const sorted = [...this.agences()].sort((a, b) => {
      let valA: any = a[column];
      let valB: any = b[column];

      if (column === 'ville_agence' || column === 'nom_agence') {
        valA = valA?.toLowerCase() || '';
        valB = valB?.toLowerCase() || '';
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    this.agences.set(sorted);
  }
  resetFilters() {
    this.filters = {
      nom_agence: '',
      ville_agence: '',
      code_postal_agence: '',
    };
    this.loadAgences();
  }
  getStarHtml(note: number): string {
    const fullStars = Math.floor(note);
    const hasHalfStar = note % 1 >= 0.25 && note % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '⯨';
    stars += '☆'.repeat(emptyStars);
    return stars;
  }
}
