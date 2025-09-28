<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoitureResource extends JsonResource
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
            'immatriculation' => $this->immatriculation,
            'marque' => $this->marque,
            'modele' => $this->modele,
            'kilometrage' => $this->kilometrage,
            'etat' => $this->etat,
            'image' => $this->image,
            'prix_jour' => $this->prix_jour,
            'agence' => new AgenceResource($this->agence),
            'categorie' => new CategorieResource($this->categorie),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
