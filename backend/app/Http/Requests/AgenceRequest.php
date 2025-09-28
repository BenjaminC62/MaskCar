<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AgenceRequest extends FormRequest
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
            'nom_agence' => 'required|string|between:2,50',
            'code_postal_agence' => 'required|string|between:2,50',
            'nom_rue_agence' => 'required|string|between:2,50',
            'num_rue_agence' => 'required|string|between:2,50',
            'ville_agence' => 'required|string|between:2,50',
            'note' => 'required|integer|between:0,5',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'required' => 'Le champ :attribute est obligatoire',
            'string' => 'Le champ :attribute doit être une chaîne de caractères.',
            'integer' => 'Le champ :attribute doit être un entier.',
            'between' => 'Le champ :attribute doit contenir entre :min et :max caractères.',
            'max' => 'Le champ :attribute doit contenir au maximum :max caractères.',
            'min' => 'Le champ :attribute doit contenir au minimum :min caractères.',
        ];
    }
}
