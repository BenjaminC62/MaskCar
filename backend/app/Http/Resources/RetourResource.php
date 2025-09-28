<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RetourResource extends JsonResource
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
            'date_retour' => $this->date_retour,
            'kilometrage' => $this->kilometrage,
            'niveau_essence' => $this->niveau_essence,
            'etat_exterieur' => $this->etat_exterieur,
            'etat_interieur' => $this->etat_interieur,
            'commentaire' => $this->commentaire,
            'voiture' => new VoitureResource($this->voiture),
            'client' => new ClientResource($this->client),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
