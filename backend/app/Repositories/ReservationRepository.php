<?php

namespace App\Repositories;

use App\Http\Requests\RetourRequest;
use App\Http\Resources\RetourResource;
use App\Models\Avenant;
use App\Models\Location;
use App\Models\Retour;
use App\Models\Retrait;
use App\Models\Voiture;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class ReservationRepository implements ReservationRepositoryInterface
{
    public function getAllLocations(array $params = []): Collection
    {
        $query = Location::query();
        if (!empty($params['client_id'])) {
            $query->where('client_id', $params['client_id']);
        }
        if (!empty($params['voiture_id'])) {
            $query->where('voiture_id', $params['voiture_id']);
        }
        if (!empty($params['date_debut']) && !empty($params['date_fin'])) {
            $query->whereBetween('debut_location', [$params['date_debut'], $params['date_fin']]);
        }
        return $query->get();
    }

    public function createLocation(array $data): Location
    {
        return Location::create($data);
    }


    public function getLocationById(int $id): Location
    {
        try {
            return Location::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            throw new Exception('Location non trouvée', 404);
        }
    }

    public function updateLocation(int $id, array $data): Location
    {
        try {
            $location = Location::findOrFail($id);
            $location->update($data);
            return $location;
        } catch (ModelNotFoundException $e) {
            throw new Exception('Location non trouvée', 404);
        } catch (Exception $e) {
            throw new Exception('Erreur lors de la mise à jour de la location', 500);
        }
    }

    public function cancelLocation(int $id): void
    {
        try {
            $location = Location::findOrFail($id);
            $location->update(['etat_location' => 'annulée']);
        } catch (ModelNotFoundException $e) {
            throw new Exception('Location non trouvée', 404);
        }
    }

    public function getLocationsByClient(int $clientId): Collection
    {
        return Location::where('client_id', $clientId)->get();
    }

    public function getLocationsByVoiture(int $voitureId): Collection
    {
        return Location::where('voiture_id', $voitureId)->get();
    }

    public function retraitVehicule(int $id, array $data): Retrait
    {
        try {
            $location = Location::findOrFail($id);
            $id_client = $location->client_id;

            $retrait = Retrait::create([
                'voiture_id' => $data['voiture_id'],
                'client_id' => $id_client,
                'date_retrait' => $data['date_retrait'],
                'kilometrage' => $data['kilometrage'],
                'niveau_essence' => $data['niveau_essence'],
                'etat_exterieur' => $data['etat_exterieur'],
                'etat_interieur' => $data['etat_interieur'],
                'commentaire' => $data['commentaire'],
            ]);


            $location->update(['etat_location' => 'En cours']);

            $location->retrait_id = $retrait->id;
            $location->voiture_id = $data['voiture_id'];

            $location->save();

            return $retrait;
        } catch (ModelNotFoundException $e) {
            throw new Exception('Location non trouvée pour le retrait du véhicule', 404);
        }
    }

    public function retourVehicule(int $id, array $data): Retour
    {
        try {
            $location = Location::findOrFail($id);
            $location->update(['etat_location' => 'terminée']);
            $voiture_id = $location->voiture_id;
            $id_client = $location->client_id;

            $retour = Retour::create([
                'voiture_id' => $voiture_id,
                'client_id' => $id_client,
                'date_retour' => $data['date_retour'],
                'kilometrage' => $data['kilometrage'],
                'niveau_essence' => $data['niveau_essence'],
                'etat_exterieur' => $data['etat_exterieur'],
                'etat_interieur' => $data['etat_interieur'],
                'commentaire' => $data['commentaire'],
            ]);

            $location->retour_id = $retour->id;

            $location->prix_location = $this->calculerPrixTotal($location);

            $location->save();

            return $retour;
        } catch (ModelNotFoundException $e) {
            throw new Exception('Location non trouvée pour le retour du véhicule', 404);
        }
    }

    public function getLocationsByAgence(int $agenceId): Collection
    {
        $voitureIds = Voiture::where('agence_id', $agenceId)->pluck('id');
        return Location::whereIn('voiture_id', $voitureIds)->get();
    }

    /**
     * Calcule le prix total de la location en fonction de la durée et du prix de la voiture
     *
     * @param Location $location
     * @return float
     */
    public function calculerPrixTotal(Location $location): float
    {
        $dateDebut = Carbon::parse($location->debut_location);
        $dateFin = Carbon::parse($location->fin_location);

        $nombreJours = max(1, $dateDebut->diffInDays($dateFin));

        $voiture = Voiture::findOrFail($location->voiture_id);
        $prixJournalier = $voiture->prix_jour;

        $prixBase =  $nombreJours * $prixJournalier;

        $prixAvenants = Avenant::where('location_id', $location->id)->sum('montant');

        return $prixBase + $prixAvenants;
    }

    public function createAvenant(array $data): Avenant
    {
        $location = Location::findOrFail($data['idReservation']);

        $avenant = Avenant::create([
            'detail_penalite_avenant' => $data['detail_penalite_avenant'],
            'montant_a_payer_avenant' => $data['montant_a_payer_avenant'],
        ]);

        $location->avenant_id = $avenant->id;
        $location->save();

        return $avenant;
    }

    public function deleteReservation(int $id): void
    {
        try {
            $location = Location::findOrFail($id);
            if ($location->etat_location === 'terminée') {
                throw new Exception('La location ne peut pas être supprimée car elle n\'est pas terminée');
            }
            if ($location->etat_location === 'En cours') {
                throw new Exception('La location ne peut pas être supprimée car elle est en cours');
            }
            $location->delete();
        } catch (ModelNotFoundException $e) {
            Log::error('Location not found for deletion', ['id' => $id, 'exception' => $e->getMessage()]);
            throw new Exception('Location non trouvée pour la suppression', 404);
        } catch (Exception $e) {
            Log::error('Error during location deletion', ['id' => $id, 'exception' => $e->getMessage()]);
            throw new Exception('Erreur lors de la suppression de la location', 500);
        }
    }

}
