<?php

namespace Database\Factories;

use App\Models\Agence;
use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Voiture>
 */
class VoitureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $etats = ['disponible', 'réservée', 'louée', 'en_reparation', 'en_maintenance'];

        $images = [
            'Peugeot' => 'https://www.peugeot-lunel.fr/imgcommun/photogamme/1000/800/non/tjesebjb-hybride1.PNG',
            'Renault' => 'https://louizicarentals.com/wp-content/uploads/2020/05/renault-clio-rouge-2019.jpg',
            'Citroën' => 'https://visuel3d-secure.citroen.com/V3DImage.ashx?client=SOLVCG&ratio=1&format=jpg&quality=90&width=1280&height=100%&back=0&view=004&version=1CSCA5EJLKL0A022&color=0MM00NVH&trim=0PNA0RFX&mkt=FR',
            'Volkswagen' => 'https://www.marketoy.com/media/catalog/product/cache/8568c7e347f81f58c7fc88722be58d67/4/0/405-1_1.jpg',
            'Toyota' => 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijxVt0-oH9rMJMqwTQosOg-WH7tiXuS1vE3GUkBprTJisfpJq7_mKmSVUoCaztUqhtE_RUbPWeYv7H1RYc8H4lSsn4Z2rZNh8kpGq8co0ZQkXnCIhdj3_hURyB93hEoSEr6oPqF5oQi9bE/s1600/toyota-aygo-rouge-chilien-red-pop-2019.jpg',
            'Honda' => 'https://www.marketoy.com/media/catalog/product/cache/8568c7e347f81f58c7fc88722be58d67/o/t/ot1019_2_.jpg',
            'Ford' => 'https://live.dealer-asset.co/fr1495/siteassets/Thumbnail_Focus_ActiveX.jpg',
            'Nissan' => 'https://www-europe.nissan-cdn.net/content/dam/Nissan/fr/vehicles/JUKE/configurateur/880203ax-F77-20TDIEULHD_JUKE_MY21_34_Front_LHD_ACENTA_NO-FOGLIGHT_1064x698.jpg.ximg.l_12_m.smart.jpg',
            'BMW' => 'https://www.actu-automobile.com/wp-content/uploads/2024/09/BMW-Serie-1-rouge_-1-jpeg.webp',
            'Mercedes' => 'https://modelkars.com/wp-content/uploads/GT920-MERCEDES-BENZ-C63-AMG-EDITION-507-RED-gts-models-10.webp',
            'Audi' => 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiWKJeYS5xw7T5betTuxJgKVNip8c6DFQVEAXyz39A8CeVymxtLXvocaKGncP4dHjDLd9aGZmAoiWCv6aV-GRCt1LTxoQiSNH58y36tT7T5f_La-IwAgedv7JAbYkE2ioH6nUaXJF4tpaCc/s1000/audi-rs3-rouge-tango-red-2024.jpg',
        ];

        return [
            'immatriculation' => strtoupper(fake()->bothify('??-###-??')),
            'marque' => $marque = fake()->randomElement(['Peugeot', 'Renault', 'Citroën', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Nissan', 'BMW', 'Mercedes', 'Audi']),
            'modele' => fake()->word(),
            'kilometrage' => fake()->numberBetween(0, 200000),
            'etat' => fake()->randomElement($etats),
            'image' => $images[$marque],
            'prix_jour' => fake()->randomFloat(2, 20, 200),
            'agence_id' => Agence::factory(),
            'categorie_id' => Categorie::factory(),
        ];
    }
}
