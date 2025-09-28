export type Garantie = {
  id: number;
  montant_garantie: number;
  created_at?: string;
  updated_at?: string;
}

export type GetResponseGarantie = {
  data: Garantie[];
}

export type GetResponseGarantieById = {
  success: boolean;
  data: {
    garantie: Garantie;
  };
  message: string;
}
