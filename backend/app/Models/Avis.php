<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    protected $fillable = [
        'contenu',
        'note',
        'agence_id',
        'client_id',
    ];

    protected $table = 'avis';

    public function agence()
    {
        return $this->belongsTo(Agence::class, 'agence_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
}
