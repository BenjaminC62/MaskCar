import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { VoitureService } from '../../services/voiture.service';
import { Voiture } from '../../models/Voiture';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports: [
    RouterLink,
    NgIf
  ],
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  voitures = signal<Voiture[]>([]);
  isLoaded = false;
  private voitureService = inject(VoitureService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const marque = this.route.snapshot.paramMap.get('marque');
    if (marque) {
      this.loadVoituresByMarque(marque);
    }
  }

  async loadVoituresByMarque(marque: string): Promise<void> {
    try {
      const result = await this.voitureService.getVoituresByMarque(marque);
      this.voitures.set(result)
    } catch (error) {
      console.error('Erreur lors du chargement des voitures par marque:', error);
    } finally {
      this.isLoaded = true;
    }
  }
}
