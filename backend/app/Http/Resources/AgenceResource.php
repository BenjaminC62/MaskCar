<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgenceResource extends JsonResource
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
            'nom_agence' => $this->nom_agence,
            'code_postal_agence' => $this->code_postal_agence,
            'nom_rue_agence' => $this->nom_rue_agence,
            'num_rue_agence' => $this->num_rue_agence,
            'ville_agence' => $this->ville_agence,
            'note' => $this->note,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
