<?php

namespace Database\Seeders;

use App\Models\Agence;
use App\Models\Categorie;
use App\Models\Voiture;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VoitureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agenceIds = Agence::all()->pluck('id')->toArray();
        $categorieIds = Categorie::all()->pluck('id')->toArray();

        for ($i = 0; $i < 200; $i++) {
            Voiture::factory()->create([
                'agence_id' => $agenceIds[array_rand($agenceIds)],
                'categorie_id' => $categorieIds[array_rand($categorieIds)],
            ]);
        }

    }
}
