<?php

use App\Models\Agence;
use App\Models\Avenant;
use App\Models\Categorie;
use App\Models\Client;
use App\Models\Garantie;
use App\Models\Retour;
use App\Models\Retrait;
use App\Models\Voiture;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->json('liste_location');
            $table->date('debut_location');
            $table->date('fin_location');
            $table->enum('etat_location', ['En cours', 'terminée' , 'annulée', 'Payée'])->default('Payée');
            $table->decimal('prix_location', 10, 2)->nullable();
            $table->foreignIdFor(Client::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Voiture::class)->nullable()->constrained()->onDelete('cascade');
            $table->foreignIdFor(Retrait::class)->nullable()->constrained()->onDelete('cascade');
            $table->foreignIdFor(Retour::class)->nullable()->constrained()->onDelete('cascade');
            $table->foreignIdFor(Garantie::class)->nullable()->constrained()->onDelete('cascade');
            $table->foreignIdFor(Avenant::class)->nullable()->constrained()->onDelete('cascade');
            $table->foreignIdFor(Agence::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Categorie::class)->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
