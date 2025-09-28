import { Component, inject, OnInit, signal } from '@angular/core';
import { Voiture } from '../../../models/Voiture';
import { VoitureService } from '../../../services/voiture.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-liste-voitures',
  standalone: true,
  imports: [RouterLink, FormsModule, NgForOf, NgIf],
  templateUrl: './liste-voitures.component.html',
  styleUrls: ['./liste-voitures.component.css']
})
export class ListeVoituresComponent implements OnInit {
  voitures = signal<Voiture[]>([]);
  private voitureService = inject(VoitureService);
  isLoaded = false;
  filters = {
    categorie: '',
    etat: ''
  };

  etats: string[] = ['réservée', 'disponible', 'en_maintenance', 'louée','en_reparation'];

  private route = inject(ActivatedRoute);
  sortColumn: keyof Voiture | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  agenceId: number | null = null;

  ngOnInit(): void {
    const agenceId = this.route.snapshot.paramMap.get('id');
    if (agenceId) {
      this.agenceId = parseInt(agenceId, 10);
      this.loadVoitures(this.agenceId);
    }
  }

  async loadVoitures(agenceId: number): Promise<void> {
    try {
      const response = await this.voitureService.getVoituresByAgenceId(agenceId);

      const filtered = response.filter(voiture => {
        const matchCategorie = voiture.categorie.type_categorie.toLowerCase().includes(this.filters.categorie.toLowerCase());
        const matchEtat = this.filters.etat ? voiture.etat.toLowerCase() === this.filters.etat.toLowerCase() : true;
        return matchCategorie && matchEtat;
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

      this.voitures.set(sorted);
    } catch (error) {
      console.error('Erreur lors du chargement des voitures :', error);
    }finally {
      this.isLoaded = true;
    }
  }

  sortBy(column: keyof Voiture) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    if (this.agenceId !== null) {
      const sorted = [...this.voitures()].sort((a, b) => {
        let valA: any = a[column];
        let valB: any = b[column];

        if (column === 'categorie') {
          valA = a.categorie?.type_categorie.toLowerCase() || '';
          valB = b.categorie?.type_categorie.toLowerCase() || '';
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return this.sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });

      this.voitures.set(sorted);
    }
  }

  resetFilters() {
    this.filters = {
      categorie: '',
      etat: ''
    };
    if (this.agenceId !== null) {
      this.loadVoitures(this.agenceId);
    }
  }
}
