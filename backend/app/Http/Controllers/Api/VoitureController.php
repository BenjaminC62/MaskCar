<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\VoitureResource;
use App\Models\Voiture;

class VoitureController extends BaseController
{
    public function index()
    {
        // On recupere toutes les voitures
        $voitures = Voiture::all();
        // On retourne la collection des voitures
        return VoitureResource::collection($voitures);
    }

    public function getByAgence($id)
    {
        // On recupere toutes les voitures d'une agence
        $voitures = Voiture::where('agence_id', $id)->get();
        // On retourne la collection des voitures de cette agence
        return VoitureResource::collection($voitures);
    }

    public function getVoitureById($id)
    {
        $voiture = Voiture::find($id);
        return new VoitureResource($voiture);
    }

    public function update(\Illuminate\Http\Request $request, $id)
    {
        $validatedData = $request->validate([
            'kilometrage' => 'integer|min:0',
            'etat' => 'string|max:255',
        ]);

        $voiture = Voiture::findOrFail($id);

        $voiture->update($validatedData);

        return response()->json([
            'message' => 'Voiture updated successfully',
            'voiture' => new VoitureResource($voiture),
        ]);
    }
    public function getVoituresByMarque($marque)
    {
        try {
            $voitures=Voiture::where('marque', $marque)->get();
            $success= VoitureResource::collection($voitures);
            return $this->sendResponse($success, 'Voitures retrieved successfully');
        }catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->sendError('Voiture not found', [], 404);
        }
        catch (\Exception $e) {
            return $this->sendError('Something went wrong! Process not completed', [], 500);
        }
    }
}
