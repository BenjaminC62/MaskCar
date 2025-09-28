<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermisResource extends JsonResource
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
            'num_permis_client' => $this->num_permis_client,
            'date_permis_client' => $this->date_permis_client,
            'pays_permis_client' => $this->pays_permis_client,
            'client' => new ClientResource($this->client),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
