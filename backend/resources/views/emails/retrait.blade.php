<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Votre Retrait de Véhicule</title>
</head>
<body>
<h2>Bonjour {{ $reservation->client->nom_client ?? '' }},</h2>

<p>Nous vous confirmons que le véhicule réservé a bien été retiré.</p>

<h3>Détails :</h3>
<ul>
    <li><strong>Réservation n° :</strong> {{ $reservation->id }}</li>
    <li><strong>Véhicule :</strong> {{ $reservation->voiture->marque ?? '' }} {{ $reservation->voiture->modele ?? '' }}</li>
    <li><strong>Immatriculation :</strong> {{ $reservation->voiture->immatriculation ?? '' }}</li>
</ul>

<p>Vous trouverez en pièce jointe le document officiel de retrait.</p>

<p>Merci pour votre confiance,</p>
<p>L’équipe de l’agence {{ $reservation->agence->nom_agence ?? '' }}</p>
</body>
</html>
