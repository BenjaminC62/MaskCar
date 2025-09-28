<?php

use App\Models\Client;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facturations', function (Blueprint $table) {
            $table->id();
            $table->string('nom_rue_facturations');
            $table->string('num_rue_facturations');
            $table->string('code_postal_facturations');
            $table->string('ville_facturations');
            $table->string('pays_facturations');
            $table->foreignIdFor(Client::class)->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facturations');
    }
};
