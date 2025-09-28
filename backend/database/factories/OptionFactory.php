<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Option>
 */
class OptionFactory extends Factory
{

    private static int $index = 0;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $options = ['GPS', 'Climatisation', 'Sièges chauffants', 'Bluetooth', 'Caméra de recul', 'Toit ouvrant' , 'Régulateur de vitesse', 'Système audio premium', 'Volant chauffant', 'Détecteur de pluie', 'Aide au stationnement', 'Système de navigation', 'Accoudoir central', 'Phares à LED', 'Jantes en alliage léger'];

        return [
            'nom_option' => function () use ($options) {
                $value = $options[self::$index];
                self::$index = (self::$index + 1) % count($options); // Increment and reset index
                return $value;
            },
            'montant_option' => fake()->randomFloat(2, 5, 200),
        ];
    }
}
