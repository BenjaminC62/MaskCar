<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RetourRequest extends FormRequest
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
            'date_retour' => 'required|date',
            'kilometrage' => 'required|integer',
            'niveau_essence' => 'required|string',
            'etat_exterieur' => 'required|string',
            'etat_interieur' => 'required|string',
            'commentaire' => 'nullable|string',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'required' => 'Le champ :attribute est obligatoire.',
            'array' => 'Le champ :attribute doit être un tableau.',
            'date' => 'Le champ :attribute doit être une date valide.',
            'after' => 'Le champ :attribute doit être après le champ :other.',
            'numeric' => 'Le champ :attribute doit être un nombre.',
        ];
    }
}
