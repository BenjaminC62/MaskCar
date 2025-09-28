import {User} from './User';

export type Client = {
  id: number;
  nom_client: string;
  prenom_client: string;
  email_client: string;
  tel_client: string;
  nom_rue_client: string;
  num_rue_client: string;
  ville_client: string;
  code_postal_client: string;
  pays_client: string;
  date_naissance_client: string;
  user: User;
  created_at?: string;
  updated_at?: string;
}

export type GetResponseClient = {
  success: boolean;
  data: {
    clients: Client[];
  };
  message: string;
}

export type GetResponseClientById = {
  success: boolean;
  data: {
    client: Client;
  };
  message: string;
}
