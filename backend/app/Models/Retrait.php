<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Retrait extends Model
{
    protected $fillable = [
        'date_retrait',
        'kilometrage',
        'niveau_essence',
        'etat_exterieur',
        'etat_interieur',
        'commentaire',
        'voiture_id',
        'client_id',
    ];

    protected $table = 'retraits';

    public function voiture(): BelongsTo
    {
        return $this->belongsTo(Voiture::class, 'voiture_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'location_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
}
