import {Client} from './Client';
import {Voiture} from './Voiture';

export type Retrait = {
  id: number;
  date_retrait: Date;
  kilometrage: number;
  niveau_essence: string;
  etat_exterieur: string;
  etat_interieur: string;
  commentaire: string;
  client: Client;
  voiture: Voiture;
  created_at?: string;
  updated_at?: string;
}

export type GetResponseRetrait = {
  success: boolean;
  data: {
    retraits: Retrait[];
  };
  message: string;
}

export type GetResponseRetraitById = {
  success: boolean;
  data: {
    retrait: Retrait;
  };
  message: string;
}
