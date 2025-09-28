<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Log;

class BaseController extends Controller implements HasMiddleware {

    /**
     * Send a success response.
     *
     * @param mixed $result The result data to be sent in the response.
     * @param string $message The success message to be sent in the response.
     * @return JsonResponse The JSON response containing the success status, result data, and message.
     */
    public function sendResponse(mixed $result, string $message): JsonResponse {
        $response = [
            'success' => true,
            'data' => $result,
            'message' => $message,
        ];

        return response()->json($response, 200);
    }

    /**
     * Return an error response.
     *
     * @param string $error The error message to be sent in the response.
     * @param array $errorMessages Additional error messages to be sent in the response.
     * @param int $code The HTTP status code for the response.
     * @return JsonResponse The JSON response containing the error status, message, and additional error data.
     */
    public function sendError(string $error, array $errorMessages = [], int $code = 404): JsonResponse {
        $response = [
            'success' => false,
            'message' => $error,
        ];

        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }

        return response()->json($response, $code);
    }

    /**
     * Log the exception and throw an HTTP response exception.
     *
     * @param \Exception $e The exception to be logged.
     * @param string $message The error message to be sent in the response. Defaults to "Something went wrong! Process not completed".
     * @throws HttpResponseException
     */
    public function throw(\Exception $e, string $message = "Something went wrong! Process not completed", int $code = 500): void {
        Log::info($e);
        throw new HttpResponseException(response()->json(["message" => $message], $code));
    }


    public static function middleware() {
        return [
            new Middleware(middleware: 'auth:sanctum', except: ['login', 'register']),
        ];
    }
}
