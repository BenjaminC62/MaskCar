<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agence extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_agence',
        'code_postal_agence',
        'nom_rue_agence',
        'numero_rue_agence',
        'ville_agence',
        'note_agence',
    ];

    protected $table = 'agences';

    public function voitures(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Voiture::class, 'agence_id');
    }

    public function avis(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Avis::class, 'agence_id');
    }

    /**
     * Obtenir les locations associées à l'agence.
     */
    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }
}
