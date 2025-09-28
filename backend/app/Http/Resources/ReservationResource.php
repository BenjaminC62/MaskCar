<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'liste_location' => $this->liste_location,
            'debut_location' => $this->debut_location,
            'fin_location' => $this->fin_location,
            'prix_location' => $this->prix_location,
            'etat_location' => $this->etat_location,
            'client' => new ClientResource($this->client),
            'voiture' => new VoitureResource($this->voiture),
            'garantie' => new GarantieResource($this->garantie),
            'categorie' => new CategorieResource($this->categorie),
            'agence' => new AgenceResource($this->agence),
            'avenant_id' => $this->avenant_id,
            'retour_id' => $this->retour_id,
            'retrait_id' => $this->retrait_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

}
