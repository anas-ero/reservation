<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
   public function handle(Request $request, Closure $next, string $role)
   {
    if (!Auth::check() || Auth::user()->role !== $role) {
        // if they arent the right role , kick them back to the homepage
        abort(403, "Unauthorized action");
    }

    return $next($request);
   }
}
