import {Component, inject, OnInit, OnDestroy, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { CategorieService } from '../../services/categorie.service';
import { Categorie } from '../../models/Categorie';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {VoitureService} from '../../services/voiture.service';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-accueil',
  imports: [RouterLink, NgForOf, FormsModule, MatFormField, MatLabel, MatInput, ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, MatFormField, AsyncPipe, MatButton, NgIf],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
  standalone: true,
})
export class AccueilComponent implements OnInit, OnDestroy {
  private categorieService = inject(CategorieService);
  voitureService = inject(VoitureService);
  router = inject(Router);

  marqueControl = new FormControl('');
  marques: string[] = [];
  categories: Categorie[] = [];
  images: string[] = [
    './assets/images/voiture_compact2.png',
    './assets/images/v5-removebg-preview.png',
    './assets/images/suv_confort.png',
    './assets/images/monospace-removebg-preview.png',
    './assets/images/fourgon-compact-153839-removebg-preview.png',
    './assets/images/20240604_110451-scaled-removebg-preview.png',
    './assets/images/voiture_sport.png',
    './assets/images/break.png',
    './assets/images/pick-up-removebg-preview.png',
  ];

  currentIndex = 0;
  autoSlideInterval: any;
  showSuggestions = false;

  async ngOnInit() {
    this.loadCategories();
    this.startAutoSlide();
    const voitures = await this.voitureService.getAllVoitures();
    this.marques = [...new Set(voitures.map(v => v.marque))];


    this.voitureService.getAllVoitures().then(voitures => {
      const allMarques = voitures.map(v => v.marque);
      this.marques = [...new Set(allMarques)];
    });

    // Affiche les suggestions dès qu'on tape
    this.marqueControl.valueChanges.subscribe(() => {
      this.showSuggestions = true;
    });
  }

  rechercher(): void {
    const marque = this.marqueControl.value;
    if (marque) {
      this.router.navigate(['/voitures/marque', marque]);
    }
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  async loadCategories(): Promise<void> {
    const response = await this.categorieService.getCategories();
    this.categories = response.data;
  }

  get visibleCategories(): Categorie[] {
    return this.categories.slice(this.currentIndex, this.currentIndex + 3);
  }

  get visibleImages(): string[] {
    return this.images.slice(this.currentIndex, this.currentIndex + 3);
  }

  next(): void {
    if (this.currentIndex + 3 >= this.categories.length) {
      this.currentIndex = 0;
    } else {
      this.currentIndex += 3;
    }
  }

  prev(): void {
    if (this.currentIndex === 0) {
      this.currentIndex = this.categories.length - 3;
    } else {
      this.currentIndex -= 3;
    }
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }

  get totalPages(): number[] {
    const pages = Math.ceil(this.categories.length / 3);
    return Array.from({ length: pages }, (_, i) => i);
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.next();
    }, 5000);
  }

  filteredMarques(): string[] {
    const input = this.marqueControl.value?.toLowerCase() || '';
    return this.marques.filter(marque =>
      marque.toLowerCase().includes(input)
    );
  }

  selectMarque(marque: string): void {
    this.marqueControl.setValue(marque);
    this.showSuggestions = false;
  }

  hideSuggestions(): void {
    setTimeout(() => (this.showSuggestions = false), 200);
  }

}
