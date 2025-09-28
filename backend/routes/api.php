<?php

use App\Http\Controllers\Api\AgenceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\GarantieController;
use App\Http\Controllers\Api\OptionController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\VoitureController;
use Illuminate\Support\Facades\Route;

Route::post('clients', [ClientController::class, 'store'])->withoutMiddleware('auth:sanctum')->name('clients.store');
Route::get('check-email/{email}', [ClientController::class, 'checkEmailExists'])->withoutMiddleware('auth:sanctum')->name('clients.check.email');

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login')->name('login');
    Route::post('register', 'register')->name('register');
    Route::post('logout', 'logout')->name('logout');
    Route::get('me', 'me')->name('me');
});

Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:sanctum')->name('refresh');


Route::prefix('clients')->middleware('auth:sanctum')->group(function () {
    Route::get('', [ClientController::class, 'index'])->name('clients.index');
    Route::get('{id}', [ClientController::class, 'show'])->name('clients.show');
    Route::put('{id}', [ClientController::class, 'update'])->name('clients.update');
    Route::post('{id}/facturation', [ClientController::class, 'storeFacturation'])->name('clients.store.facturation');
    Route::post('{id}/conducteur', [ClientController::class, 'storeConducteur'])->name('clients.store.conducteur');
    Route::put('{id}/facturation', [ClientController::class, 'updateFacturation'])->name('clients.update.facturation');
    Route::get('{id}/facturation', [ClientController::class, 'getFacturationById'])->name('clients.get.facturation');
    Route::get('user/{id}', [ClientController::class, 'getClientByUserId'])->name('clients.get.by.user');
    Route::put('{id}/conducteur', [ClientController::class, 'updateConducteur'])->name('clients.update.conducteur');
    Route::get('{id}/permis', [ClientController::class, 'getPermisById'])->name('clients.get.permis.by.user');
});


Route::prefix('agences')->group(function () {
    Route::get('', [AgenceController::class, 'index'])->name('agences.index');
});

Route::get('reservations/telecharger-facture/{idReservation}', [ReservationController::class, 'telechargerFacture'])->withoutMiddleware('auth:sanctum')->name('reservations.telecharger.facture');
Route::get('reservations/telecharger-document-retrait/{idReservation}', [ReservationController::class, 'telechargerFactureRetrait'])->withoutMiddleware('auth:sanctum')->name('reservations.telecharger.facture.retrait');

Route::get('reservations/telecharger-facture-retour/{idReservation}', [ReservationController::class, 'telechargerFactureRetour'])->withoutMiddleware('auth:sanctum')->name('reservations.telecharger.facture.retour');

Route::prefix('voitures')->middleware('auth:sanctum')->group(function () {
    Route::get('', [VoitureController::class, 'index'])->name('voitures.index');
    Route::get('{id}', [VoitureController::class, 'getVoitureById']);
    Route::get('agence/{id}', [VoitureController::class, 'getByAgence'])->name('voitures.agence');
    Route::put('{id}', [VoitureController::class, 'update'])->name('voitures.update');
    Route::get('marque/{marque}', [VoitureController::class, 'getVoituresByMarque'])->name('voitures.marque');
});


Route::prefix('reservations')->middleware('auth:sanctum')->group(function () {
    Route::post('', [ReservationController::class, 'store'])->name('reservations.store');
    Route::get('', [ReservationController::class, 'index'])->name('reservations.index');
    Route::get('client/{id}', [ReservationController::class, 'getByClient'])->name('reservations.client');
    Route::get('agence/{id}', [ReservationController::class, 'getByAgence'])->name('reservations.agence');
    Route::get('voiture/{id}', [ReservationController::class, 'getByVoiture'])->name('reservations.voiture');
    Route::get('{id}', [ReservationController::class, 'show'])->name('reservations.show');
    Route::put('{id}', [ReservationController::class, 'update'])->name('reservations.update');
    Route::get('annule/{id}', [ReservationController::class, 'cancel'])->name('reservations.cancel');
    Route::post('{id}/retrait', [ReservationController::class, 'retrait'])->name('reservations.retrait');
    Route::post('{id}/retour', [ReservationController::class, 'retour'])->name('reservations.retour');
    Route::post('avenant', [ReservationController::class, 'createAvenant'])->name('reservations.avenant');
    Route::delete('{id}', [ReservationController::class, 'deleteReservation'])->name('reservations.delete');
});


Route::prefix('categories')->group(function () {
    Route::get('', [CategorieController::class, 'index']);
});

Route::prefix('options')->group(function () {
    Route::get('', [OptionController::class, 'index']);
    Route::get('{id}', [OptionController::class, 'show']);
});

Route::prefix('garanties')->group(function () {
    Route::get('', [GarantieController::class, 'index']);
});


