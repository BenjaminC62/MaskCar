<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Retour extends Model
{
    protected $fillable = [
        'date_retour',
        'kilometrage',
        'niveau_essence',
        'etat_exterieur',
        'etat_interieur',
        'commentaire',
        'voiture_id',
        'client_id',
    ];

    protected $table = 'retours';


    public function voiture()
    {
        return $this->belongsTo(Voiture::class, 'voiture_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
}
