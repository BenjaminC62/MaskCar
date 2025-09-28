<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OptionResource;
use App\Models\Option;

class OptionController extends Controller
{
    public function index()
    {
        // On recupere toutes les options
        $options = Option::all();
        // On retourne la collection des options
        return OptionResource::collection($options);
    }

    public function show($id)
    {
        // On recupere une option par son id
        $option = Option::findOrFail($id);
        // On retourne l'option
        return new OptionResource($option);
    }
}
