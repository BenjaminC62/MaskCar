<?php

namespace Database\Seeders;

use App\Enum\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::factory([
            'nom' => 'Duchmol',
            'prenom' => 'Robert',
            'email' => 'robert.duchmol@domain.fr',
            'password' => Hash::make('GrosSecret123'),
            'role' => Role::ADMIN,
        ])->create();

        $agentReservation1 = User::factory([
            'nom' => 'Morel',
            'prenom' => 'Mathias',
            'email' => 'morel.mathias@domain.fr',
            'password' => Hash::make('GrosSecret2'),
            'role' => Role::AGENT,
        ])->create();

        $agentReservation2 = User::factory([
            'nom' => 'Cornet',
            'prenom' => 'Benjamin',
            'email' => 'cornet.benjamin@domain.fr',
            'password' => Hash::make('GrosSecret3'),
            'role' =>  Role::AGENT,
        ])->create();
    }
}
