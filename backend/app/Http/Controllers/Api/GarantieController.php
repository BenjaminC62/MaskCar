<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GarantieResource;
use App\Models\Garantie;

class GarantieController extends Controller
{
    public function index()
    {
        // On recupere toutes les garanties
        $garanties = Garantie::all();
        // On retourne la collection des garanties
        return GarantieResource::collection($garanties);
    }
}
