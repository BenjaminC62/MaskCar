<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
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
            'nom_client' => $this->nom_client,
            'prenom_client' => $this->prenom_client,
            'tel_client' => $this->tel_client,
            'code_postal_client' => $this->code_postal_client,
            'ville_client' => $this->ville_client,
            'pays_client' => $this->pays_client,
            'nom_rue_client' => $this->nom_rue_client,
            'num_rue_client' => $this->num_rue_client,
            'email_client' => $this->email_client,
            'date_naissance_client' => $this->date_naissance_client,
            'user' => new UserResource($this->user),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
