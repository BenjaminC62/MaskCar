<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->enum('type_categorie' , ['Citadine', 'Berline', 'SUV', 'Monospace', 'Utilitaire', 'Coupé', 'Cabriolet', 'Break', 'Pick-up']);
            $table->string('description');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categorie');
    }
};
