<?php

namespace Database\Seeders;

use App\Models\Garantie;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GarantieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Garantie::factory(10)->create();
    }
}
