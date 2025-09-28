export type Agence = {
  id: number;
  nom_agence: string;
  code_postal_agence: string;
  nom_rue_agence: string;
  num_rue_agence: string;
  ville_agence: string;
  note: number;
  created_at?: string;
  updated_at?: string;
}

export type GetResponseAgence = {
  success: boolean;
  data: {
    agences: Agence[];
  };
  message: string;
}

export type GetResponseAgenceById = {
  success: boolean;
  data: {
    agence: Agence;
  };
  message: string;
}
