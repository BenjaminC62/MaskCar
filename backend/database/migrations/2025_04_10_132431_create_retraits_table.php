<?php

use App\Enum\EtatExterieurInterieur;
use App\Enum\NiveauEssence;
use App\Models\Client;
use App\Models\Location;
use App\Models\User;
use App\Models\Voiture;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('retraits', function (Blueprint $table) {
            $table->id();
            $table->date('date_retrait');
            $table->integer('kilometrage');
            $table->enum('niveau_essence' , array_column(NiveauEssence::cases(), 'value'));
            $table->string('etat_exterieur', array_column(EtatExterieurInterieur::cases(), 'value'));
            $table->string('etat_interieur', array_column(EtatExterieurInterieur::cases(), 'value'));
            $table->string('commentaire');
            $table->foreignIdFor(Client::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Voiture::class)->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('retraits');
    }
};
