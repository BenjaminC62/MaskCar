<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
            'nom' => 'required|string|between:2,50',
            'prenom' => 'required|string|between:2,50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
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
            'email' => 'Le champ :attribute doit être une adresse e-mail valide.',
            'unique' => 'Le champ :attribute doit être unique dans la table users.',
            'between' => 'Le champ :attribute doit contenir entre :min et :max caractères.',
            'max' => 'Le champ :attribute doit contenir au maximum :max caractères.',
            'min' => 'Le champ :attribute doit contenir au minimum :min caractères.',
        ];
    }
}
