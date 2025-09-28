<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\AvenantRequest;
use App\Http\Requests\ReservationRequest;
use App\Http\Requests\RetourRequest;
use App\Http\Requests\RetraitRequest;
use App\Http\Resources\AvenantResource;
use App\Http\Resources\ReservationResource;
use App\Http\Resources\RetourResource;
use App\Http\Resources\RetraitResource;
use App\Mail\ReservationMail;
use App\Mail\RetourMail;
use App\Mail\RetraitMail;
use App\Models\Avenant;
use App\Models\Document;
use App\Models\Retrait;
use App\Repositories\ReservationRepositoryInterface;
use Dompdf\Dompdf;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use JetBrains\PhpStorm\NoReturn;

class ReservationController extends BaseController
{
    protected ReservationRepositoryInterface $reservationRepo;

    public function __construct(ReservationRepositoryInterface $reservationRepo)
    {
        $this->reservationRepo = $reservationRepo;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $collection = $this->reservationRepo->getAllLocations($request->only(['client_id', 'voiture_id', 'date_debut', 'date_fin']));
        $success = ['reservations' => ReservationResource::collection($collection)];
        return $this->sendResponse($success, 'Reservations retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ReservationRequest $request): JsonResponse
    {
        try {
            $reservation = $this->reservationRepo->createLocation($request->all());

            $dompdf = new Dompdf();
            $dompdf->loadHtml(view('pdf.reservation', ['reservation' => $reservation]));
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $filename = 'facture_' . $reservation->id . '_' . time() . '.pdf';
            $path = 'factures/' . $filename;

            if(!Storage::put('factures/' . $filename, $dompdf->output())) {
                throw new Exception('Failed to save PDF file.');
            }

            $reservation->document()->create([
                'type_document' => 'facture',
                'lien_document_pdf' => $path,
                'location_id' => $reservation->id,
            ]);

            if ($reservation->client && $reservation->client->email_client) {
                Mail::to($reservation->client->email_client)
                    ->send(new ReservationMail($reservation, $path));
            }

        } catch (Exception $e) {
            return $this->sendError('Reservation not created', ['error' => $e->getMessage() ], 500);
        }
        $success = ['reservation' => new ReservationResource($reservation)];
        return $this->sendResponse($success, 'Reservation created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $reservation = $this->reservationRepo->getLocationById($id);
        } catch (Exception $e) {
            return $this->sendError($e->getMessage(), [], $e->getCode() ?: 404);
        }

        $data = ['reservation' => new ReservationResource($reservation)];
        return $this->sendResponse($data, 'Reservation retrieved successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $reservation = $this->reservationRepo->updateLocation($id, $request->all());
        } catch (Exception $e) {
            return $this->sendError('Reservation not updated', ['error' => $e->getMessage()], 500);
        }

        $success = ['reservation' => new ReservationResource($reservation)];
        return $this->sendResponse($success, 'Reservation updated successfully');
    }

    /**
     * Cancel the specified reservation.
     */
    public function cancel(int $id): JsonResponse
    {
        try {
            $this->reservationRepo->cancelLocation($id);
        } catch (Exception $e) {
            return $this->sendError('Reservation not canceled', ['error' => $e->getMessage()], 500);
        }

        return $this->sendResponse([], 'Reservation canceled successfully');
    }

    /**
     * Retrieve reservations by client ID.
     */
    public function getByClient(int $clientId): JsonResponse
    {
        $collection = $this->reservationRepo->getLocationsByClient($clientId);
        $success = ['reservations' => ReservationResource::collection($collection)];
        return $this->sendResponse($success, 'Reservations retrieved successfully');
    }

    /**
     * Retrieve reservations by agency ID.
     */
    public function getByAgence(int $agenceId): JsonResponse
    {
        $collection = $this->reservationRepo->getLocationsByAgence($agenceId);
        $success = ['reservations' => ReservationResource::collection($collection)];
        return $this->sendResponse($success, 'Reservations retrieved successfully');
    }

    /**
     * Retrieve reservations by vehicle ID.
     */
    public function getByVoiture(int $voitureId): JsonResponse
    {
        $collection = $this->reservationRepo->getLocationsByVoiture($voitureId);
        $success = ['reservations' => ReservationResource::collection($collection)];
        return $this->sendResponse($success, 'Reservations retrieved successfully');
    }

    /**
     * Handle vehicle withdrawal for a reservation.
     */
    public function retrait(int $id, RetraitRequest $request): JsonResponse
    {
        try {
            $retrait = $this->reservationRepo->retraitVehicule($id, $request->all());

            $reservation = $this->reservationRepo->getLocationById($id);

            $dompdf = new Dompdf();
            $dompdf->loadHtml(view('pdf.retrait', ['reservation' => $reservation]));
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $filename = 'retrait_' . $reservation->id . '_' . time() . '.pdf';
            $path = 'retraits/' . $filename;

            if(!Storage::put('retraits/' . $filename, $dompdf->output())) {
                throw new Exception('Failed to save PDF file.');
            }

            $reservation->document()->create([
                'type_document' => 'Retrait',
                'lien_document_pdf' => $path,
                'location_id' => $reservation->id,
            ]);

            if ($reservation->client && $reservation->client->email_client) {
                Mail::to($reservation->client->email_client)
                    ->send(new RetraitMail($reservation, $path));
            }

        } catch (Exception $e) {
            return $this->sendError('Vehicle withdrawal failed', ['error' => $e->getMessage()], 500);
        }

        $success = ['retrait' => new RetraitResource($retrait)];
        return $this->sendResponse($success, 'Vehicle withdrawal recorded successfully');
    }

    /**
     * Handle vehicle return for a reservation.
     */
    public function retour(int $id, RetourRequest $request): JsonResponse
    {
        try {
            $reservation = $this->reservationRepo->retourVehicule($id, $request->all());

            $reservationRetour = $this->reservationRepo->getLocationById($id);

            $prixTotal = $this->reservationRepo->calculerPrixTotal($reservationRetour);

            $dompdf = new Dompdf();
            $dompdf->loadHtml(view('pdf.retour', ['reservation' => $reservationRetour, 'prixTotal' => $prixTotal, 'vehicule' => $reservationRetour->voiture, 'retour' => $reservation, 'client' => $reservationRetour->client]));
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $filename = 'retour_' . $reservationRetour->id . '_' . time() . '.pdf';
            $path = 'retour/' . $filename;

            if(!Storage::put('retour/' . $filename, $dompdf->output())) {
                throw new Exception('Failed to save PDF file.');
            }

            $reservationRetour->document()->create([
                'type_document' => 'Retour',
                'lien_document_pdf' => $path,
                'location_id' => $reservationRetour->id,
            ]);

            if ($reservationRetour->client && $reservationRetour->client->email_client) {
                Mail::to($reservationRetour->client->email_client)
                    ->send(new RetourMail($reservationRetour, $path));
            }

        } catch (Exception $e) {
            return $this->sendError('Vehicle return failed', ['error' => $e->getMessage()], 500);
        }

        $success = ['retour' => new RetourResource($reservation)];
        return $this->sendResponse($success, 'Vehicle return recorded successfully');
    }

    public function createAvenant(AvenantRequest $request): JsonResponse
    {
        try {
            $avenant = $this->reservationRepo->createAvenant($request->all());

        } catch (Exception $e) {
            return $this->sendError('Avenant not created', ['error' => $e->getMessage()], 500);
        }

        $success = ['avenant' => new AvenantResource($avenant)];
        return $this->sendResponse($success, 'Avenant created successfully');
    }

    #[NoReturn] public function telechargerFacture($idReservation): \Symfony\Component\HttpFoundation\StreamedResponse|JsonResponse
    {
        $document = Document::where('location_id', $idReservation)
            ->where('type_document', 'facture')
            ->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document non trouvé pour cette réservation.'
            ], 404);
        }

        $chemin = $document->lien_document_pdf;

        if (!Storage::exists($chemin)) {
            return response()->json([
                'success' => false,
                'message' => 'Fichier non trouvé sur le serveur.'
            ], 404);
        }

        return Storage::download($chemin);
    }

    #[NoReturn] public function telechargerFactureRetour($idReservation): \Symfony\Component\HttpFoundation\StreamedResponse|JsonResponse
    {
        $document = Document::where('location_id', $idReservation)
            ->where('type_document', 'Retour')
            ->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document non trouvé pour cette réservation.'
            ], 404);
        }

        $chemin = $document->lien_document_pdf;

        if (!Storage::exists($chemin)) {
            return response()->json([
                'success' => false,
                'message' => 'Fichier non trouvé sur le serveur.'
            ], 404);
        }

        return Storage::download($chemin);
    }

    #[NoReturn] public function telechargerFactureRetrait($idReservation): \Symfony\Component\HttpFoundation\StreamedResponse|JsonResponse
    {
        $document = Document::where('location_id', $idReservation)
            ->where('type_document', 'Retrait')
            ->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document non trouvé pour cette réservation.'
            ], 404);
        }

        $chemin = $document->lien_document_pdf;

        if (!Storage::exists($chemin)) {
            return response()->json([
                'success' => false,
                'message' => 'Fichier non trouvé sur le serveur.'
            ], 404);
        }

        return Storage::download($chemin);
    }

    public function deleteReservation(int $id): JsonResponse
    {
        try {
            $this->reservationRepo->deleteReservation($id);
        } catch (Exception $e) {
            return $this->sendError('Reservation not deleted', ['error' => $e->getMessage()], 500);
        }

        return $this->sendResponse([], 'Reservation deleted successfully');
    }


}
