<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Document de Retrait</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.5;
        }

        .section {
            margin-bottom: 20px;
        }

        .section h2 {
            font-size: 16px;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #444;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #eee;
        }
    </style>
</head>
<body>
<h1>Fiche de Retrait du Véhicule</h1>

<div class="section">
    <h2>Informations Client</h2>
    <table>
        <tr><th>Nom</th><td>{{ $reservation->client->nom_client ?? 'N/A' }}</td></tr>
        <tr><th>Prénom</th><td>{{ $reservation->client->prenom_client ?? 'N/A' }}</td></tr>
        <tr><th>Email</th><td>{{ $reservation->client->email_client ?? 'N/A' }}</td></tr>
        <tr><th>Téléphone</th><td>{{ $reservation->client->tel_client ?? 'N/A' }}</td></tr>
    </table>
</div>

<div class="section">
    <h2>Informations Véhicule</h2>
    <table>
        <tr><th>Marque</th><td>{{ $reservation->voiture->marque ?? 'N/A' }}</td></tr>
        <tr><th>Modèle</th><td>{{ $reservation->voiture->modele ?? 'N/A' }}</td></tr>
        <tr><th>Immatriculation</th><td>{{ $reservation->voiture->immatriculation ?? 'N/A' }}</td></tr>
        <tr><th>Kilométrage départ</th><td>{{ $reservation->voiture->kilometrage ?? 'N/A' }} km</td></tr>
    </table>
</div>

<div class="section">
    <h2>Détails de la Réservation</h2>
    <table>
        <tr><th>Date début</th><td>{{ $reservation->debut_location ?? 'N/A' }}</td></tr>
        <tr><th>Date fin</th><td>{{ $reservation->fin_location ?? 'N/A' }}</td></tr>
        <tr><th>Agence</th><td>{{ $reservation->agence->nom_agence ?? 'N/A' }}</td></tr>
    </table>
</div>

<div class="section">
</div>

<div class="section" style="margin-top: 40px;">
    <h2>Signatures</h2>
    <table style="border: none;">
        <tr>
            <td style="width: 50%; border: none; padding-bottom: 50px; vertical-align: bottom;">
                <p>Signature du client :</p>
                <div style="border-top: 1px solid #000; margin-top: 50px;"></div>
                <p style="margin-top: 5px;">Nom et prénom : {{ $reservation->client->nom_client ?? '' }} {{ $reservation->client->prenom_client ?? '' }}</p>
            </td>
            <td style="width: 50%; border: none; padding-bottom: 50px; vertical-align: bottom;">
                <p>Signature de l'agent :</p>
                <div style="border-top: 1px solid #000; margin-top: 50px;"></div>
                <p style="margin-top: 5px;">Nom et prénom : _____________________________</p>
            </td>
        </tr>
    </table>
</div>
</body>
</html>
