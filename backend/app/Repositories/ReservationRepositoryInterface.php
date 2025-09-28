<?php

namespace App\Repositories;

use App\Models\Avenant;
use App\Models\Location;
use App\Models\Retour;
use App\Models\Retrait;
use Illuminate\Support\Collection;

interface ReservationRepositoryInterface
{
    /**
     * Retourne toutes les réservations.
     *
     * @return Collection<Location>
     */
    public function getAllLocations(): Collection;

    /**
     * Crée une réservation.
     *
     * @param array $data
     * @return Location
     */
    public function createLocation(array $data): Location;

    /**
     * Retourne une réservation par son ID.
     *
     * @param int $id
     * @return Location
     */
    public function getLocationById(int $id): Location;

    /**
     * Met à jour une réservation.
     *
     * @param int $id
     * @param array $data
     * @return Location
     */
    public function updateLocation(int $id, array $data): Location;

    /**
     * Annule une réservation.
     *
     * @param int $id
     * @return void
     */
    public function cancelLocation(int $id): void;

    /**
     * Retourne les réservations d’un client.
     *
     * @param int $clientId
     * @return Collection<Location>
     */
    public function getLocationsByClient(int $clientId): Collection;

    /**
     * Retourne les réservations d’une agence.
     *
     * @param int $agenceId
     * @return Collection<Location>
     */
    public function getLocationsByAgence(int $agenceId): Collection;

    /**
     * Retourne les réservations d’une voiture.
     *
     * @param int $voitureId
     * @return Collection<Location>
     */
    public function getLocationsByVoiture(int $voitureId): Collection;

    /**
     * Enregistre le retrait du véhicule (début location).
     *
     * @param int $id
     * @param array $data
     * @return Retrait
     */
    public function retraitVehicule(int $id, array $data): Retrait;

    /**
     * Enregistre le retour du véhicule (fin location).
     *
     * @param int $id
     * @param array $data
     * @return Retour
     */
    public function retourVehicule(int $id, array $data): Retour;

    /**
     * Crée un avenant pour un retour d'une réservation.
     *
     * @param array $data
     * @return Location
     */
    public function createAvenant(array $data): Avenant;
}
