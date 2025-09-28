<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacturationResource extends JsonResource
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
            'nom_rue_facturations' => $this->nom_rue_facturations,
            'num_rue_facturations' => $this->num_rue_facturations,
            'code_postal_facturations' => $this->code_postal_facturations,
            'ville_facturations' => $this->ville_facturations,
            'pays_facturations' => $this->pays_facturations,
            'client' => new ClientResource($this->client),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
