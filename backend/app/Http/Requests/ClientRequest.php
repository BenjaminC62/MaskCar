<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
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
            'nom_client' => 'required|string|between:2,50',
            'prenom_client' => 'required|string|between:2,50',
            'email_client' => 'required|string|between:2,50',
            'tel_client' => 'required|string|between:2,50',
            'code_postal_client' => 'required|string|between:2,50',
            'ville_client' => 'required|string|between:2,50',
            'pays_client' => 'required|string|between:2,50',
            'nom_rue_client' => 'required|string|between:2,50',
            'num_rue_client' => 'required|string|between:2,50',
            'date_naissance_client' => 'required|date',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages() : array
    {
        return [
            'required' => 'Le champ :attribute est obligatoire',
            'string' => 'Le champ :attribute doit être une chaîne de caractères.',
            'numeric' => 'Le champ :attribute doit être un nombre.',
            'between' => 'Le champ :attribute doit contenir entre :min et :max caractères.',
            'max' => 'Le champ :attribute doit contenir au maximum :max caractères.',
            'min' => 'Le champ :attribute doit contenir au minimum :min caractères.',
            'date' => 'Le champ :attribute doit être une date valide.',
        ];
    }
}
