<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Garantie extends Model
{
    use HasFactory;

    protected $fillable = [
        'montant_garantie',
    ];

    protected $table = 'garanties';

    public function locations()
    {
        return $this->hasMany(Location::class, 'garantie_id');
    }
}
