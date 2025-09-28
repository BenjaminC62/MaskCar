<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
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
            'type_document' => $this->type_document,
            'lien_document_pdf' => $this->lien_document_pdf,
            'location' => new LocationResource($this->location),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
