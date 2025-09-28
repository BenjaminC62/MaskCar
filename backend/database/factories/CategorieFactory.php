<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Categorie>
 */
class CategorieFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type_categorie' => $this->faker->randomElement([
                'citadine', 'berline', 'suv', 'monospace', 'utilitaire',
                'coupé', 'cabriolet', 'break', 'pick-up'
            ]),
            'description' => function ($attributes) {
                $descriptions = [
                    'citadine' => 'Idéale pour la ville avec sa taille compacte et sa maniabilité exceptionnelle',
                    'berline' => 'Confort optimal pour les longs trajets avec un espace intérieur généreux',
                    'suv' => 'Position de conduite surélevée offrant une excellente visibilité et sécurité',
                    'monospace' => 'Spacieux et modulable pour transporter toute la famille en tout confort',
                    'utilitaire' => 'Pratique pour les professionnels avec un volume de chargement optimisé',
                    'coupé' => 'Design sportif avec des performances à la hauteur de son style élégant',
                    'cabriolet' => 'Sensation de liberté grâce à son toit rétractable et son allure dynamique',
                    'break' => 'Polyvalent avec son grand coffre et son confort pour les trajets quotidiens',
                    'pick-up' => 'Robuste et tout-terrain, idéal pour les usages professionnels et de loisirs'
                ];
                return $descriptions[$attributes['type_categorie']];
            },
        ];
    }
}
