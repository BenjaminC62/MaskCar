<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ClientRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\ClientResource;
use App\Http\Resources\PersonneResource;
use App\Http\Resources\UserResource;
use App\Models\Client;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends BaseController
{
    public function register(ClientRequest $request) : JsonResponse
    {
        $validatedData = $request->validate(array_merge($request->rules(), [
            'password' => 'required|string|min:6',
        ]));
        try {
            DB::beginTransaction();

            $email = $validatedData['email_client'];

            if (User::where('email', $email)->exists()) {
                throw new Exception('L\'adresse mail est déjà utilisée');
            }

            $user = User::create([
                'nom' => $validatedData['nom_client'],
                'prenom' => $validatedData['prenom_client'],
                'email' => $email,
                'password' => Hash::make($validatedData['password']),
            ]);

            $client = Client::create([
                'nom_client' => $validatedData['nom_client'],
                'prenom_client' => $validatedData['prenom_client'],
                'nom_rue_client' => $validatedData['nom_rue_client'],
                'num_rue_client' => $validatedData['num_rue_client'],
                'tel_client' => $validatedData['tel_client'],
                'code_postal_client' => $validatedData['code_postal_client'], // Assurez-vous que cette ligne est présente
                'ville_client' => $validatedData['ville_client'],
                'date_naissance_client' => $validatedData['date_naissance_client'],
                'pays_client' => $validatedData['pays_client'],
                'email_client' => $email,
                'user_id' => $user->id,
            ]);

            DB::commit();

            $success['token'] = $user->createToken('auth_token')->plainTextToken;
            $success['token_type'] = 'Bearer';
            $success['client'] = new ClientResource($client);

            return $this->sendResponse($success, 'Client enregistré avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Error.', ['error' => $e->getMessage()], 422);
        }
    }

    /**
     * Handle the login request.
     *
     * @param Request $request The incoming request instance.
     * @return JsonResponse The response containing the authentication token or error message.
     */
    public function login(Request $request): JsonResponse {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->sendError('Unauthorised.', ['error' => 'Unauthorised'], 401);
        }

        $user = Auth::user();
        $success['user'] = new UserResource($user);
        $success['token'] = $user->createToken('auth_token')->plainTextToken;
        $success['token_type'] = 'Bearer';

        return $this->sendResponse($success, 'User login successfully.');
    }

    /**
     * Get the authenticated user's information.
     *
     * @param Request $request The incoming request instance.
     * @return JsonResponse The response containing the authenticated user's information.
     */
    public function me(Request $request): JsonResponse {
        $client = $request->user()->client;
        if ($client) {
            $success['client'] = new ClientResource($client);
            return $this->sendResponse($success, 'Client information.');
        }
        $success['user'] = new UserResource(Auth::user());
        return $this->sendResponse($success, 'User information.');
    }

    /**
     * Handle the logout request.
     *
     * @return JsonResponse The response confirming the user has been logged out.
     */
    public function logout(): JsonResponse {
        auth()->user()->tokens()->delete();
        return $this->sendResponse([], 'Logged out successfully.');
    }

    /**
     * Get the authenticated user's information.
     *
     * @param Request $request The incoming request instance.
     * @return JsonResponse The response containing the authenticated user's information.
     */
    public function refresh() {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $user = Auth::user();
        $success['token'] = $user->createToken('auth_token')->plainTextToken;
        $success['token_type'] = 'Bearer';  // Type de token
        $success['user'] = $user;
        return response()->json($success);
    }

}
