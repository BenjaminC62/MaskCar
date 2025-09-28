<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voiture extends Model
{
    use HasFactory;

    protected $fillable= [
        'immatriculation',
        'marque',
        'modele',
        'kilometrage',
        'etat',
        'image',
        'prix_jour',
        'agence_id',
        'categorie_id',
    ];

    protected $table = 'voitures';

    public function agence()
    {
        return $this->belongsTo(Agence::class, 'agence_id');
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class, 'categorie_id');
    }

    public function retours()
    {
        return $this->hasMany(Retour::class, 'id_voiture');
    }

    public function locations()
    {
        return $this->hasMany(Location::class, 'id_voiture');
    }


}
