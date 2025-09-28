<?php

use App\Models\Agence;
use App\Models\Categorie;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voitures', function (Blueprint $table) {
            $table->id();
            $table->string('immatriculation')->unique();
            $table->string('marque');
            $table->string('modele');
            $table->integer('kilometrage');
            $table->enum('etat', ['disponible', 'réservée', 'louée', 'en_reparation', 'en_maintenance']);
            $table->string('image')->nullable();
            $table->decimal('prix_jour', 10, 2);
            $table->foreignIdFor(Agence::class)->constrained();
            $table->foreignIdFor(Categorie::class)->constrained();
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('voitures');
    }
};
