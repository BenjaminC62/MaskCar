import {Client} from './Client';

export type Facturation = {
  id: number;
  nom_rue_facturations: string;
  num_rue_facturations: string;
  code_postal_facturations: string;
  ville_facturations: string;
  pays_facturations: string;
  client_id: Client;
  created_at?: string;
  updated_at?: string;
}

export type GetResponsesFacture = {
  success: boolean;
  data: {
    facture: Facturation[];
  };
  message: string;
}

export type GetResponseFacture = {
  success: boolean;
  data: {
    facture: Facturation;
  };
  message: string;
}
