<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Agence>
 */
class AgenceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom_agence' => $this->faker->company,
            'code_postal_agence' => $this->faker->postcode,
            'nom_rue_agence' => $this->faker->streetName,
            'num_rue_agence' => $this->faker->buildingNumber,
            'ville_agence' => $this->faker->city,
            'note' => $this->faker->numberBetween(1, 5),
        ];
    }
}
