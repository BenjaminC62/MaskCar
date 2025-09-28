<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AvenantRequest extends FormRequest
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
            'detail_penalite_avenant' => 'required|string|max:255',
            'montant_a_payer_avenant' => 'required|numeric|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'required' => 'Ce champ est obligatoire',
            'string' => 'Ce champ doit être une chaîne de caractères',
            'max' => 'Ce champ ne doit pas dépasser :max caractères',
            'numeric' => 'Ce champ doit être un nombre',
            'min' => 'Ce champ ne peut pas être inférieur à :min'
        ];
    }
}
