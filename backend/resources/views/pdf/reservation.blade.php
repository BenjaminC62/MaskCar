<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture de Réservation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        .header {
            border-bottom: 1px solid #ddd;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .facture-info {
            margin-bottom: 30px;
        }
        .facture-number {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
        }
        .client-info, .reservation-info {
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table th, table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        table th {
            background-color: #f2f2f2;
        }
        .total-section {
            margin-top: 20px;
            text-align: right;
        }
        .footer {
            margin-top: 50px;
            font-size: 12px;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
    </style>
</head>
<body>
<div class="header">
    <div class="logo">MaskCar</div>
    <div>Service de location de voitures</div>
</div>

<div class="facture-info">
    <div class="facture-number">FACTURE N° {{ $reservation->id }}/{{ date('Y', strtotime($reservation->created_at)) }}</div>
    <div>Date d'émission: {{ date('d/m/Y', strtotime($reservation->created_at)) }}</div>
</div>

<div class="vehicule">
    <p><strong>Type véhicule : </strong>{{ $reservation->categorie->type_categorie }}</p>
    <p><strong>Description véhicule : </strong>{{ $reservation->categorie->description }}</p>
</div>

<div class="client-info">
    <h3>Informations client</h3>
    <p><strong>Nom:</strong> {{ $reservation->client->nom_client ?? 'N/A' }} {{ $reservation->client->prenom_client ?? 'N/A' }}</p>
    <p><strong>Adresse:</strong> {{ $reservation->client->facturations->first()->num_rue_facturations ?? 'N/A' }} {{ $reservation->client->facturations->first()->nom_rue_facturations ?? 'N/A' }},
        {{ $reservation->client->facturations->first()->code_postal_facturations ?? 'N/A' }} {{ $reservation->client->facturations->first()->ville_facturations ?? 'N/A' }}</p>
    <p><strong>Email:</strong> {{ $reservation->client->email_client ?? 'N/A' }}</p>
    <p><strong>Téléphone:</strong> {{ $reservation->client->tel_client ?? 'N/A' }}</p>
</div>

<div class="reservation-info">
    <p><strong>Agence de retrait:</strong> {{ $reservation->agence->nom_agence ?? 'N/A' }}</p>
    <p><strong>Date de début:</strong> {{ date('d/m/Y', strtotime($reservation->debut_location)) }}</p>
    <p><strong>Date de fin:</strong> {{ date('d/m/Y', strtotime($reservation->fin_location)) }}</p>
    <p><strong>Durée:</strong> {{ (new DateTime($reservation->debut_location))->diff(new DateTime($reservation->fin_location))->days }} jour(s)</p>
</div>

<div class="footer">
    <p>Merci de votre confiance. Pour toute question concernant cette facture, veuillez nous contacter.</p>
    <p>CAR RENTAL - SIRET: 123 456 789 00012 - TVA: FR12345678900</p>
    <p>maskcar.contact@gmail.com - +33 1 23 45 67 89</p>
</div>
</body>
</html>
