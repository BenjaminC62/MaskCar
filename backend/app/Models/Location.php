<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Location extends Model
{
    use HasFactory;

    /**
     * Le nom de la table associée au modèle.
     *
     * @var string
     */
    protected $table = 'locations';


    /**
     * Les attributs qui sont assignables en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'liste_location',
        'debut_location',
        'fin_location',
        'etat_location',
        'prix_location',
        'client_id',
        'voiture_id',
        'garantie_id',
        'agence_id',
        'avenant_id',
        'retrait_id',
        'retour_id',
        'categorie_id'
    ];

    /**
     * Les attributs qui doivent être convertis.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'liste_location' => 'array',
        'prix_location' => 'float',
        'debut_location' => 'datetime',
        'fin_location' => 'datetime',
    ];

    /**
     * Obtenir le client associé à la location.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    /**
     * Obtenir la voiture associée à la location.
     */
    public function voiture(): BelongsTo
    {
        return $this->belongsTo(Voiture::class, 'voiture_id');
    }

    /**
     * Obtenir la garantie associée à la location.
     */
    public function garantie(): BelongsTo
    {
        return $this->belongsTo(Garantie::class, 'garantie_id');
    }

    /**
     * Obtenir l'avenant associé à la location.
     */
    public function avenant(): BelongsTo
    {
        return $this->belongsTo(Avenant::class, 'avenant_id');
    }

    /**
     * Obtenir le retour associé à la location.
     */
    public function retour(): HasOne
    {
        return $this->hasOne(Retour::class, 'location_id');
    }

    /**
     * Obtenir le retrait associé à la location.
     */
    public function retrait(): HasOne
    {
        return $this->hasOne(Retrait::class, 'retrait_id');
    }

    /**
     * Obtenir le document associé à la location.
     */
    public function document(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Obtenir l'option associée à la location.
     */
    public function option(): BelongsTo
    {
        return $this->belongsTo(Option::class, 'option_id');
    }

    /**
     * Obtenir la catégorie de la voiture associée à la location.
     */
    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }

    /**
     * Obtenir l'agence associée à la location.
     */
    public function agence(): BelongsTo
    {
        return $this->belongsTo(Agence::class);
    }
}
