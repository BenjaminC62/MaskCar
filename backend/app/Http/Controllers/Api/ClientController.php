<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClientRequest;
use App\Http\Resources\ClientResource;
use App\Http\Resources\FacturationResource;
use App\Http\Resources\PermisResource;
use App\Models\Client;
use App\Repositories\ClientRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class ClientController extends BaseController
{
    protected ClientRepositoryInterface $clientRepo;

    public function __construct(ClientRepositoryInterface $clientRepo)
    {
        $this->clientRepo = $clientRepo;
    }


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        if (!Gate::allows('voir-clients', auth()->user())) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $collection = $this->clientRepo->getAllClients($request->only(['sort', 'order', 'nom', 'prenom', 'email', 'telephone', 'identification']));
        $success = ['clients' => ClientResource::collection($collection)];
        return $this->sendResponse($success, 'Clients retrieved successfully');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(ClientRequest $request) : JsonResponse
    {
        try {
            $client = $this->clientRepo->createClient($request->all());
        }catch (\Exception $e) {
            return $this->sendError('Client not created', ['error' => $e->getMessage()], 500);
        }
        $success = ['client' => new ClientResource($client)];
        return $this->sendResponse($success, 'Client created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show($id) : JsonResponse
    {
        try {
            $client = $this->clientRepo->getClientById($id);
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], $e->getCode() ?: 404);
        }

        $data = ['client' => new ClientResource($client)];
        return $this->sendResponse($data, 'Client retrieved successfully');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id) : JsonResponse
    {
        try {
            $client = $this->clientRepo->updateClient($id, $request->all());
        } catch (\Exception $e) {
            return $this->sendError('Client not updated', ['error' => $e->getMessage()], 500);
        }

        $success = ['client' => new ClientResource($client)];
        return $this->sendResponse($success, 'Client updated successfully');
    }

    /**
     * Ajoute une facturation à un client.
     */
    public function storeFacturation(Request $request, int $id) : JsonResponse {
        try {
            $this->clientRepo->addFacturation($id, $request->all());
        } catch (\Exception $e) {
            return $this->sendError('Facturation not created', ['error' => $e->getMessage()], 500);
        }
        $client = $this->clientRepo->getClientById($id);
        $facture = $client->facturations()->latest()->first();
        $success = ['facture' => new FacturationResource($facture)];
        return $this->sendResponse($success, 'Facturation created successfully');
    }

    /**
     * Ajoute un conducteur à un client.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function storeConducteur(Request $request, int $id) : JsonResponse {
        try {
            $this->clientRepo->addConducteur($id, $request->all());
        } catch (\Exception $e) {
            return $this->sendError('Conducteur not created', ['error' => $e->getMessage()], 500);
        }
        $client = $this->clientRepo->getClientById($id);
        $conducteur = $client->permis()->latest()->first();
        $success = ['conducteur' => new PermisResource($conducteur)];
        return $this->sendResponse($success, 'Conducteur created successfully');
    }

    /**
     * Met à jour une facturation d'un client.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateFacturation(Request $request, int $id) : JsonResponse {
        try {
            $this->clientRepo->updateFacturation($id, $request->all());
        } catch (\Exception $e) {
            return $this->sendError('Facturation not updated', ['error' => $e->getMessage()], 500);
        }
        $client = $this->clientRepo->getClientById($id);
        $facture = $client->facturations()->latest()->first();
        $success = ['facture' => new FacturationResource($facture)];
        return $this->sendResponse($success, 'Facturation updated successfully');
    }

    /**
     * Met à jour un conducteur d'un client.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateConducteur(Request $request, int $id) : JsonResponse {
        try {
            $this->clientRepo->updatePermisConducteur($id, $request->all());
        } catch (\Exception $e) {
            return $this->sendError('Conducteur not updated', ['error' => $e->getMessage()], 500);
        }
        $client = $this->clientRepo->getClientById($id);
        $conducteur = $client->permis()->latest()->first();
        $success = ['conducteur' => new PermisResource($conducteur)];
        return $this->sendResponse($success, 'Conducteur updated successfully');
    }


    /**
     * Retourne la facturation d'un client par son ID.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function getFacturationById(int $id) : JsonResponse {
        try {
            $facture = $this->clientRepo->getFacturationById($id);
        } catch (\Exception $e) {
            return $this->sendError('Facturation not found', ['error' => $e->getMessage()], 500);
        }
        $success = ['facture' => new FacturationResource($facture)];
        return $this->sendResponse($success, 'Facturation retrieved successfully');
    }

    /**
     * Retourne le client par son ID utilisateur.
     *
     * @return JsonResponse
     */
    public function getClientByUserId(int $id) : JsonResponse
    {
        try {
            $client = $this->clientRepo->getClientByUserId($id);
        } catch (\Exception $e) {
            return $this->sendError('Client not found', ['error' => $e->getMessage()], 500);
        }
        $success = ['client' => new ClientResource($client)];
        return $this->sendResponse($success, 'Client retrieved successfully');
    }

    public function checkEmailExists(string $email) : JsonResponse
    {
        $email = trim(strtolower($email));
        $exists = $this->clientRepo->checkEmailExists($email);

        if ($exists) {
            return $this->sendResponse(['exists' => true], 'Email already exists');
        } else {
            return $this->sendResponse(['exists' => false], 'Email does not exist');
        }
    }

    public function getPermisById(int $id): JsonResponse
    {
        try {
            $permis = $this->clientRepo->getPermisById($id);
        } catch (\Exception $e) {
            return $this->sendError('Permis not found', ['error' => $e->getMessage()], 500);
        }
        $success = ['permis' => new PermisResource($permis)];
        return $this->sendResponse($success, 'Permis retrieved successfully');
    }
}
