<?php

namespace App\Providers;

use App\Enum\Role;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::define('voir-clients', fn($user) => in_array($user->role, [Role::ADMIN, Role::AGENT]));

        Gate::define('admin', fn($user) => $user->role === Role::ADMIN);
        Gate::define('agent', fn($user) => $user->role === Role::AGENT);
        Gate::define('client', fn($user) => $user->role === Role::CLIENT);

        Gate::define('creer-reservation', fn($user) => in_array($user->role, [Role::AGENT, Role::CLIENT]));
        Gate::define('edit-reservation', fn($user) => $user->role === Role::AGENT);
        Gate::define('consult-reservations', fn($user) => in_array($user->role, [Role::AGENT, Role::CLIENT]));
        Gate::define('effec-retour-retrait', fn($user) => $user->role === Role::AGENT);
        Gate::define('ajout-avenant', fn($user) => $user->role === Role::AGENT);
        Gate::define('access-totale', fn($user) => $user->role === Role::ADMIN);

    }
}
