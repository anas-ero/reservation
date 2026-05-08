<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckOwnerVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        //  if they are an owner but not verified yert
        if ($user && $user->role === 'owner' && !$user->is_verified) {
            

            if (!$request->routeIs('partner.pending')) {
                return redirect()->route('partner.pending');
            }
        }

        return $next($request);
    }
}
