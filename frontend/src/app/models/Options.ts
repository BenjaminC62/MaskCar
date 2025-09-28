export type Options = {
  id: number;
  nom_option: string;
  montant_option: number;
  created_at?: string;
  updated_at?: string;
}

export type GetResponseOptions = {
  data: Options[];
}


export type GetResponseOptionsById = {
  data: Options;
}
