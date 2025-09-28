<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OptionResource extends JsonResource
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
            'nom_option' => $this->nom_option,
            'montant_option' => $this->montant_option,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
