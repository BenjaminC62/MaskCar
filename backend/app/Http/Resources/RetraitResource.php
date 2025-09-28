<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RetraitResource extends JsonResource
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
            'date_retrait' => $this->date_retrait,
            'kilometrage' => $this->kilometrage,
            'niveau_essence' => $this->niveau_essence,
            'etat_exterieur' => $this->etat_exterieur,
            'etat_interieur' => $this->etat_interieur,
            'commentaire' => $this->commentaire,
            'client_id' => new ClientResource($this->client),
            'voiture' => new VoitureResource($this->voiture),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
