import {Client} from './Client';

export type Permis = {
  id: number;
  num_permis_client: string;
  date_permis_client: string;
  pays_permis_client: string;
  client_id: Client;
  created_at?: string;
  updated_at?: string;
}

export type GetResponsesPermis = {
  success: boolean;
  data: {
    permis: Permis[];
  };
  message: string;
}

export type GetResponsePermis = {
  success: boolean;
  data: {
    permis: Permis;
  };
  message: string;
}
