<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;

    protected $fillable = [
        'type_categorie',
        'description'
    ];

    protected $table = 'categories';

    public function voitures()
    {
        return $this->hasMany(Voiture::class, 'categorie_id');
    }

    /**
     *  Donne le type de la catégorie
     */
    public function locations()
    {
        return $this->hasMany(Location::class);
    }
}
