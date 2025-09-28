<?php

namespace App\Enum;

enum Role: string
{
    case ADMIN = 'admin';
    case AGENT = 'agent';
    case CLIENT = 'client';
}
