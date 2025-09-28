import {Voiture} from './Voiture';
import {Client} from './Client';

export type Retour = {
  id: number;
  date_retour: Date;
  kilometrage: number;
  niveau_essence: string;
  etat_exterieur: string;
  etat_interieur: string;
  voiture: Voiture;
  client: Client;
  created_at?: string;
  updated_at?: string;
}

export type GetResponseRetour = {
  success: boolean;
  data: {
    retours: Retour[];
  };
  message: string;
}

export type GetResponseRetourById = {
  success: boolean;
  data: {
    retour: Retour;
  };
  message: string;
}
