export type Avenant = {
  id: number;
  detail_penalite_avenant: string;
  montant_a_payer_avenant: number;
  created_at?: string;
  updated_at?: string;
}

export type GetResponseAvenant = {
  data : Avenant;
}

export type GetResponsesAvenant = {
  data : Avenant[];
}

export type createReservation = {
  detail_penalite_avenant: string;
  montant_a_payer_avenant: number;
}
