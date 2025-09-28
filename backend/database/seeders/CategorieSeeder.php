<?php

namespace Database\Seeders;

use App\Models\Categorie;
use Illuminate\Database\Seeder;

class CategorieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'type_categorie' => 'Citadine',
                'description' => 'Idéale pour la ville avec sa taille compacte et sa maniabilité exceptionnelle.',
            ],
            [
                'type_categorie' => 'Berline',
                'description' => 'Confort optimal pour les longs trajets avec un espace intérieur généreux.',
            ],
            [
                'type_categorie' => 'SUV',
                'description' => 'Position de conduite surélevée offrant une excellente visibilité et sécurité.',
            ],
            [
                'type_categorie' => 'Monospace',
                'description' => 'Spacieux et modulable pour transporter toute la famille en tout confort.',
            ],
            [
                'type_categorie' => 'Utilitaire',
                'description' => 'Pratique pour les professionnels avec un volume de chargement optimisé.',
            ],
            [
                'type_categorie' => 'Coupé',
                'description' => 'Design sportif avec des performances à la hauteur de son style élégant',
            ],
            [
                'type_categorie' => 'Cabriolet',
                'description' => 'Sensation de liberté grâce à son toit rétractable et son allure dynamique.',
            ],
            [
                'type_categorie' => 'Break',
                'description' => 'Polyvalent avec son grand coffre et son confort pour les trajets quotidiens',
            ],
            [
                'type_categorie' => 'Pick-up',
                'description' => 'Robuste et tout-terrain, idéal pour les usages professionnels et de loisirs.',
            ],
        ];

        foreach ($categories as $category) {
            Categorie::create($category);
        }
    }
}
