<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RetraitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date_retrait' => 'required|date',
            'kilometrage' => 'required|integer',
            'niveau_essence' => 'required|string',
            'etat_exterieur' => 'required|string',
            'etat_interieur' => 'required|string',
            'commentaire' => 'nullable|string',
        ];
    }

    public function messages() : array
    {
        return [
            'date_retrait.required' => 'La date de retrait est requise.',
            'kilometrage.required' => 'Le kilométrage est requis.',
            'niveau_essence.required' => 'Le niveau d\'essence est requis.',
            'etat_exterieur.required' => 'L\'état extérieur est requis.',
            'etat_interieur.required' => 'L\'état intérieur est requis.',
        ];
    }
}
