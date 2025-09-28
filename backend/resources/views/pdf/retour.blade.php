<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Facture de retour</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
        }
        .header, .footer {
            text-align: center;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 25px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #aaa;
            padding: 8px;
        }
        th {
            background-color: #eee;
        }
    </style>
</head>
<body>

<div class="header">
    <h1>Location Express</h1>
    <h2>Facture de retour</h2>
    <p>Date de génération : {{ now()->format('d/m/Y') }}</p>
</div>

<div class="section">
    <h3>Informations client</h3>
    <p><strong>Nom :</strong> {{ $reservation->client->nom_client }} {{ $reservation->client->prenom_client }}</p>
    <p><strong>Email :</strong> {{ $reservation->client->email_client }}</p>
    <p><strong>Téléphone :</strong> {{ $reservation->client->tel_client }}</p>
</div>

<div class="section">
    <h3>Détails du véhicule</h3>
    <p><strong>Marque :</strong> {{ $vehicule->marque }}</p>
    <p><strong>Modèle :</strong> {{ $vehicule->modele }}</p>
    <p><strong>Immatriculation :</strong> {{ $vehicule->immatriculation }}</p>
</div>

<div class="section">
    <h3>Détails de la réservation</h3>
    <p><strong>Date de retrait :</strong> {{ \Carbon\Carbon::parse($reservation->debut_location)->format('d/m/Y H:i') }}</p>
    <p><strong>Date de retour :</strong> {{ \Carbon\Carbon::parse($retour->date_retour)->format('d/m/Y H:i') }}</p>
    <p><strong>Durée :</strong>
        {{ \Carbon\Carbon::parse($reservation->debut_location)->diffInDays(\Carbon\Carbon::parse($retour->date_retour)) }} jour(s)
    </p>
</div>

<div class="section">
    <h3>État du véhicule au retour</h3>
    <p><strong>Kilométrage au retour :</strong> {{ $retour->kilometrage }} km</p>
    <p><strong>Niveau de carburant :</strong> {{ $retour->niveau_essence }}</p>
    <p><strong>État général :</strong> {{ $vehicule->etat }}</p>
    @if ($retour->commentaire)
        <p><strong>Remarques :</strong> {{ $retour->commentaire }}</p>
    @endif
</div>

<div class="section">
    <h3>Montant total</h3>
    <table>
        <tr>
            <th>Prix journalier</th>
            <th>Durée</th>
            <th>Total</th>
        </tr>
        <tr>
            <td>{{ number_format($vehicule->prix_jour, 2, ',', ' ') }} €</td>
            <td>
                {{ \Carbon\Carbon::parse($reservation->debut_location)->diffInDays(\Carbon\Carbon::parse($retour->date_retour)) }} jour(s)
            </td>
            <td><strong>{{ number_format($prixTotal, 2, ',', ' ') }} €</strong></td>
        </tr>
    </table>
</div>

<div class="footer">
    <p>Merci pour votre confiance !</p>
    <p>MaskCar - maskcar.contact@gmail.com</p>
</div>

</body>
</html>
