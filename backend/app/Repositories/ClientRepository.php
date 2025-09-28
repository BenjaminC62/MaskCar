<?php

namespace App\Repositories;

use App\Models\Client;
use App\Models\Facturation;
use App\Models\Permis;
use Exception;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ClientRepository implements ClientRepositoryInterface
{

    public function getAllClients(array $params = []): \Illuminate\Support\Collection
    {
        $query = Client::with('user');

        if (isset($params['sort'])) {
            $query->orderBy($params['sort'], $params['order'] ?? 'asc');
        }

        if (!empty($params['nom'])) {
            $query->where('nom_client', 'like', '%' . $params['nom'] . '%');
        }

        if (!empty($params['prenom'])) {
            $query->where('prenom_client', 'like', '%' . $params['prenom'] . '%');
        }

        if (!empty($params['email'])) {
            $query->where('email_client', 'like', '%' . $params['email'] . '%');
        }

        if (!empty($params['telephone'])) {
            $query->where('tel_client', 'like', '%' . $params['telephone'] . '%');
        }

        if (!empty($params['identification'])) {
            $query->whereHas('locations', function($q) use ($params) {
                $q->where('identifiant', 'like', '%' . $params['identification'] . '%');
            });
        }

        return $query->get();
    }

    public function getClientById($id): Client
    {
        try {
            return Client::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            throw new Exception('Client not found', 404);
        }
    }

    public function createClient(array $data): Client
    {
        return Client::create($data);
    }

    /**
     * @throws \Exception
     */
    public function addConducteur(int $clientId, array $data): void
    {
        try {
            $client = $this->getClientById($clientId);

            if (!$client) {
                throw new Exception('Client non trouvé', 404);
            }

            $client->permis()->create([
                'num_permis_client' => $data['num_permis_client'],
                'date_permis_client' => $data['date_permis_client'],
                'pays_permis_client' => $data['pays_permis_client'],
                'date_naissance_client' => $data['date_naissance_client'],
                'client_id' => $client->id,
            ]);

        } catch (Exception $e) {
            throw new Exception('Erreur lors de la création du conducteur: ' . $e->getMessage(), 500);
        }
    }

    public function addFacturation(int $clientId, array $data): void
    {
        try {
            $client = $this->getClientById($clientId);

            if (!$client) {
                throw new Exception('Client non trouvé', 404);
            }

            $client->facturations()->create([
                'nom_rue_facturations' => $data['nom_rue_client'],
                'code_postal_facturations' => $data['code_postal_client'],
                'ville_facturations' => $data['ville_client'],
                'pays_facturations' => $data['pays_client'],
                'num_rue_facturations' => $data['num_rue_client'],
                'client_id' => $client->id,
            ]);

        } catch (Exception $e) {
            throw new Exception('Erreur lors de la création de la facturation: ' . $e->getMessage(), 500);
        }
    }

    public function updateClient($id, array $data): Client
    {
        try {
            $client = Client::findOrFail($id);
            $client->update($data);
            return $client;
        } catch (ModelNotFoundException $e) {
            throw new Exception('Client not found', 404);
        } catch (Exception $e) {
            throw new Exception('Error updating client', 500);
        }
    }

    public function updatePermisConducteur(int $conducteurId, array $data): void
    {
        try {
            $client = $this->getClientById($conducteurId);

            if (!$client) {
                throw new Exception('Client non trouvé', 404);
            }

            $permis = $client->permis()->latest()->first();

            if (!$permis) {
                throw new Exception('Permis de conducteur non trouvé', 404);
            }

            $permis->update([
                'num_permis_client' => $data['num_permis_client'] ?? $permis->num_permis_client,
                'date_permis_client' => $data['date_permis_client'] ?? $permis->date_permis_client,
                'pays_permis_client' => $data['pays_permis_client'] ?? $permis->pays_permis_client,
                'date_naissance_client' => $data['date_naissance_client'] ?? $permis->date_naissance_client,
            ]);
        } catch (ModelNotFoundException $e) {
            throw new Exception('Permis de conducteur non trouvé', 404);
        } catch (Exception $e) {
            throw new Exception('Erreur lors de la mise à jour du permis: ' . $e->getMessage(), 500);
        }
    }

    public function updateFacturation(int $facturationId, array $data): void
    {
        try {
            $client = $this->getClientById($facturationId);

            if (!$client) {
                throw new Exception('Client non trouvé', 404);
            }

            $facture = $client->facturations()->latest()->first();

            if (!$facture) {
                throw new Exception('Facturation non trouvée', 404);
            }

            $facture->update([
                'nom_rue_facturations' => $data['nom_rue_client'] ?? $facture->nom_rue_facture,
                'code_postal_facturations' => $data['code_postal_client'] ?? $facture->code_postal_facture,
                'ville_facturations' => $data['ville_client'] ?? $facture->ville_facture,
                'pays_facturations' => $data['pays_client'] ?? $facture->pays_facture,
                'num_rue_facturations' => $data['num_rue_client'] ?? $facture->num_rue_facture,
            ]);
        } catch (ModelNotFoundException $e) {
            throw new Exception('Facturation not found', 404);
        } catch (Exception $e) {
            throw new Exception('Error updating facturation: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Retourne la facturation d'un client par son ID.
     *
     * @param int $id
     * @return Client
     */
    public function getFacturationById(int $id): Facturation
    {
        try {
            $client = $this->getClientById($id);

            if (!$client) {
                throw new Exception('Client non trouvé', 404);
            }

            return $client->facturations()->latest()->first();
        } catch (ModelNotFoundException $e) {
            throw new Exception('Facturation not found', 404);
        } catch (Exception $e) {
            throw new Exception('Error retrieving facturation: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Retourne le client par son ID utilisateur.
     *
     * @param int $id
     * @return Client
     */
    public function getClientByUserId(int $id): Client
    {
        try {
            return Client::where('user_id', $id)->firstOrFail();
        } catch (ModelNotFoundException $e) {
            throw new Exception('Client not found', 404);
        } catch (\Exception $e) {
            throw new Exception('Error retrieving client: ' . $e->getMessage(), 500);
        }
    }

    public function checkEmailExists($email): bool
    {
        return Client::where('email_client', $email)->exists();
    }

    public function getPermisById(int $id): Permis
    {
        try {
            $client = $this->getClientById($id);

            if (!$client) {
                throw new Exception('Client non trouvé', 404);
            }

            return $client->permis()->latest()->first();
        } catch (ModelNotFoundException $e) {
            throw new Exception('Permis not found', 404);
        } catch (\Exception $e) {
            throw new Exception('Error retrieving Permis: ' . $e->getMessage(), 500);
        }
    }
}
