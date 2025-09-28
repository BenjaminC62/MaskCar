<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>MaskCar - maskcar.contact@gmail.com</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; margin: 30px; }
        .header, .footer { text-align: center; }
        .header h1 { margin-bottom: 0; }
        .header p { margin-top: 5px; font-size: 14px; }
        .section { margin-top: 30px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table th, .table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        .table th { background-color: #f3f3f3; }
        .total { text-align: right; font-weight: bold; }
    </style>
</head>
<body>

<div class="header">
    <h1>Facture</h1>
    <p>Location Express - contact@location-express.fr</p>
</div>

<div class="section">
    <h3>Informations du client</h3>
    <p><strong>Nom :</strong> {{ $reservation->client->prenom_client }} {{ $reservation->client->nom_client }}</p>
    <p><strong>Email :</strong> {{ $reservation->client->email_client }}</p>
</div>

<div class="section">
    <h3>Détails du véhicule</h3>
    <p><strong>Modèle :</strong> {{ $vehicule->marque }} {{ $vehicule->modele }}</p>
    <p><strong>Immatriculation :</strong> {{ $vehicule->immatriculation }}</p>
</div>

<div class="section">
    <h3>Détails de la location</h3>
    <table class="table">
        <tr>
            <th>Date de début</th>
            <th>Date de retour</th>
            <th>Durée (jours)</th>
            <th>Prix journalier (€)</th>
            <th>Total (€)</th>
        </tr>
        <tr>
            <td>{{ $reservation->debut_location->format('d/m/Y H:i') }}</td>
            <td>{{ $reservation->fin_location->format('d/m/Y H:i') }}</td>
            <td>{{ $reservation->debut_location->diffInDays($reservation->fin_location) + 1 }}</td>
            <td>{{ number_format($vehicule->prix_jour, 2, ',', ' ') }} €</td>
            <td class="total">{{ number_format($reservation->montant_total, 2, ',', ' ') }} €</td>
        </tr>
    </table>
</div>

<div class="section">
    <h4>Merci pour votre confiance !</h4>
    <p>Cette facture a été générée automatiquement. Pour toute question, contactez-nous.</p>
</div>

<div class="footer">
    <p>&copy; {{ date('Y') }} MaskCar - Tous droits réservés.</p>
</div>

</body>
</html>
