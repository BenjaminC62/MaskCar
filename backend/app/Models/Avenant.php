<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Avenant extends Model
{
    use HasFactory;

    /**
     * Le nom de la table associée au modèle.
     *
     * @var string
     */
    protected $table = 'avenants';

    /**
     * Les attributs qui sont assignables en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'detail_penalite_avenant',
        'montant_a_payer_avenant',
    ];

    /**
     * Obtenir les locations associées à cet avenant.
     */
    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }
}
