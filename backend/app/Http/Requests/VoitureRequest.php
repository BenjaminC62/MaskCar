<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VoitureRequest extends FormRequest
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
            'immatriculation' => 'required|string|between:2,50',
            'marque' => 'required|string|between:2,50',
            'modele' => 'required|string|between:2,50',
            'kilometrage' => 'required|integer|between:0,999999',
            'etat' => 'required|string|between:2,50',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'prix_jour' => 'required|numeric|between:0,999999.99',
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
            'image' => 'Le fichier doit être une image.',
            'mimes' => 'L\'image doit être au format jpeg, png ou jpg.',
        ];
    }
}
