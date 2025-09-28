
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de réservation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .content {
            margin-bottom: 20px;
        }
        .reservation-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
<div class="header">
    <h1>Confirmation de votre réservation</h1>
</div>

<div class="content">
    <p>Bonjour {{ $reservation->client->nom_client ?? 'Cher client' }},</p>

    <p>Nous vous confirmons que votre réservation a été enregistrée avec succès.</p>

    <div class="reservation-details">
        <h2>Détails de la réservation</h2>
        <p><strong>Numéro de réservation :</strong> {{ $reservation->id }}</p>
        <p><strong>Type véhicule :</strong> {{ $reservation->categorie->type_categorie ?? '' }}</p>
        <p><strong>Date de début :</strong> {{ \Carbon\Carbon::parse($reservation->debut_location)->format('d/m/Y à H:i') }}</p>
        <p><strong>Date de fin :</strong> {{ \Carbon\Carbon::parse($reservation->fin_location)->format('d/m/Y à H:i') }}</p>
        <p><strong>Agence :</strong> {{ $reservation->agence->nom_agence ?? '' }}</p>
    </div>

    <p>Veuillez trouver ci-joint la facture correspondant à votre réservation.</p>

    <p>Pour toute question ou besoin d'assistance, n'hésitez pas à nous contacter.</p>

    <p>Cordialement,<br>L'équipe de location</p>
</div>

<div class="footer">
    <p>Ce mail est généré automatiquement, merci de ne pas y répondre.</p>
    <p>&copy; {{ date('Y') }} - Service de location de véhicules</p>
</div>
</body>
</html>
