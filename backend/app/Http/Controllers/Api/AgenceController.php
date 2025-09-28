<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgenceResource;
use App\Models\Agence;

class AgenceController extends Controller
{
    // Creation de la function index pour afficher la liste des agences
    public function index()
    {
        // On recupere toutes les agences
        $agences = Agence::all();
        // On retourne la collection des agences
        return AgenceResource::collection($agences);
    }
}
