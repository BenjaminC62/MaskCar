<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategorieResource;
use App\Models\Categorie;

class CategorieController extends Controller
{
    public function index()
    {
        // On recupere toutes les categories
        $categories = Categorie::all();
        // On retourne la collection des categories
        return CategorieResource::collection($categories);
    }
}
