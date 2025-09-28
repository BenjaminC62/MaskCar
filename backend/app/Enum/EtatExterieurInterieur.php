<?php

namespace App\Enum;

enum EtatExterieurInterieur : string
{
    case SALE = 'Sale';
    case PROPRE = 'Propre';
    case ABIME = 'Abimé';
}
