<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReservationRequest extends FormRequest
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
            'liste_location' => 'required|array',
            'debut_location' => 'required|date',
            'fin_location' => 'required|date|after:debut_location',
            'prix_location' => 'numeric',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array{
        return [
            'required' => 'Le champ :attribute est obligatoire.',
            'array' => 'Le champ :attribute doit être un tableau.',
            'date' => 'Le champ :attribute doit être une date valide.',
            'after' => 'Le champ :attribute doit être après le champ :other.',
            'numeric' => 'Le champ :attribute doit être un nombre.',
        ];
    }
}
