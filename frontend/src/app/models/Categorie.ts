export type Categorie = {
  id: number;
  type_categorie: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}


export type GetResponseCategorie = {
  data: Categorie[];
}

export type GetResponseCategorieById = {
  data: Categorie;
}
