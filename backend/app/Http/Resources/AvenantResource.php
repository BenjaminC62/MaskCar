<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AvenantResource extends JsonResource
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
            'detail_penalite_avenant' => $this->detail_penalite_avenant,
            'montant_a_payer_avenant' => $this->montant_a_payer_avenant,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
