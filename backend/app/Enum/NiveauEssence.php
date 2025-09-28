<?php

namespace App\Enum;

enum NiveauEssence: string
{
    case VIDE = 'Vide';
    case QUART_PLEIN = '1/4 plein';
    case DEMI_PLEIN = '1/2 plein';
    case TROIS_QUART_PLEIN = '3/4 plein';
    case PLEIN = 'Plein';

    /**
     * Récupérer toutes les valeurs pour le niveau d'essence
     */
    public static function all(): array
    {
        return [
            self::VIDE,
            self::QUART_PLEIN,
            self::DEMI_PLEIN,
            self::TROIS_QUART_PLEIN,
            self::PLEIN
        ];
    }
}
