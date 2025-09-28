import {Client} from './Client';
import {Voiture} from './Voiture';
import {Retrait} from './Retrait';
import {Garantie} from './Garantie';
import {Avenant} from './Avenant';
import {Categorie} from "./Categorie";
import {Agence} from "./Agence";

export type Reservation = {
  id: number;
  liste_location: Array<OptionReservation>;
  debut_location: Date;
  fin_location: Date;
  etat_location: string;
  prix_location: number;
  client: Client;
  voiture: Voiture | null;
  retrait: Retrait | null;
  garantie: Garantie;
  avenant: Avenant | null;
  categorie: Categorie;
  agence: Agence;
  created_at?: string;
  updated_at?: string;
}

export type OptionReservation = {
  id: number;
  designation: string;
  montant: number;
}

export type GetResponseReservation = {
  success: boolean;
  data: {
    reservations: Reservation[];
  };
  message: string;
}

export type GetResponseReservationById = {
  success: boolean;
  data: {
    reservation: Reservation;
  };
  message: string;
}

export type CreateReservation = {
    success: boolean;
    data: {
        reservation: ReservationCreate;
    };
    message: string;
}

export type ReservationCreate = {
  liste_location: Array<OptionReservation>;
  debut_location: string;
  fin_location: string;
  client_id: number;
  voiture_id: number | null;
  retrait_id: number | null;
  garantie_id: number;
  avenant_id: number | null;
  categorie_id: number;
  agence_id: number;
}

