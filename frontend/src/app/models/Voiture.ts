import {Agence} from './Agence';
import {Categorie} from './Categorie';

export type Voiture = {
  id: number;
  immatriculation: string;
  marque: string;
  modele: string;
  kilometrage: number;
  etat: string;
  image: string;
  prix_jour: number;
  agence: Agence;
  categorie: Categorie;
  created_at?: string;
  updated_at?: string;
}

export type GetResponseVoiture = {
  success: boolean;
  data: Voiture[];
  message: string;
}

export type GetResponseVoitureById = {
  success: boolean;
  data: {
    voiture: Voiture;
  };
  message: string;
}

export type GetResponseVoitureById2 = {
  data: Voiture;
}


