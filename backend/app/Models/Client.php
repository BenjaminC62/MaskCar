<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    /**
     * The name of the table associated with the model.
     *
     * @var string
     */
    protected $table = 'clients';


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom_client',
        'prenom_client',
        'tel_client',
        'code_postal_client',
        'ville_client',
        'pays_client',
        'num_rue_client',
        'nom_rue_client',
        'email_client',
        'date_naissance_client',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_naissance_client' => 'date',
    ];

    /**
     * Get the user that owns the client.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the permis associated with the client.
     */
    public function permis(): HasMany
    {
        return $this->hasMany(Permis::class, 'client_id');
    }

    /**
     * Get the factures associated with the client.
     */
    public function facturations(): HasMany
    {
        return $this->hasMany(Facturation::class, 'client_id');
    }

    /**
     * Get the avis associated with the client.
     */
    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class, 'client_id');
    }
}
