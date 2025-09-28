<?php

namespace App\Repositories;

use App\Models\Client;
use App\Models\Facturation;
use Illuminate\Support\Collection;

interface ClientRepositoryInterface
{
    /**
     * Retourne tous les clients.
     *
     * @return array<Client>
     */
    public function getAllClients() : Collection;

    /**
     * Retourne un client par son ID.
     *
     * @param int $id
     * @return Client
     */
    public function getClientById($id) : Client;

    /**
     * Crée un client.
     *
     * @param string $email
     * @return Client
     */
    public function createClient(array $data): Client;

    /**
     * Ajoute un conducteur à un client.
     *
     * @param string $email
     * @return Client
     */
    public function addConducteur(int $clientId, array $data): void;

    /**
     * Ajoute une facturation à un client.
     *
     * @param string $email
     * @return Client
     */
    public function addFacturation(int $clientId, array $data): void;

    /**
     * Met à jour un client.
     *
     * @param int $id
     * @param array $data
     * @return Client
     */
    public function updateClient($id, array $data) : Client;

    /**
     * Met à jour un conducteur d'un client.
     *
     * @param int $conducteurId
     * @param array $data
     * @return Client
     */
    public function updatePermisConducteur(int $conducteurId, array $data): void;

    /**
     * Met à jour une facturation d'un client.
     *
     * @param int $facturationId
     * @param array $data
     * @return Client
     */
    public function updateFacturation(int $facturationId, array $data): void;

    /**
     * Retourne la facturation d'un client par son ID.
     *
     * @param int $id
     * @return Client
     */
    public function getFacturationById(int $id): Facturation;

    /**
     * Retourne un client par son ID utilisateur.
     *
     * @param int $id
     * @return Client
     */
    public function getClientByUserId(int $id) : Client;

    /**
     * Check si l'email existe déjà.
     *
     * @param string $email
     * @return Client
     */
    public function checkEmailExists(string $email): bool;
}
