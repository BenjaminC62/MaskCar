<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('nom_client', 50);
            $table->string('prenom_client', 50);
            $table->string('tel_client', 15);
            $table->string('code_postal_client', 6);
            $table->string('ville_client', 50);
            $table->string('pays_client', 50);
            $table->string('nom_rue_client', 50);
            $table->string('num_rue_client', 10);
            $table->string('email_client')->unique();
            $table->date('date_naissance_client');
            $table->foreignIdFor(\App\Models\User::class)->nullable()->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
