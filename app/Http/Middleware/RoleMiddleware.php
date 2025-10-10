<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $roles = is_array($request->route('role')) ? $request->route('role') : explode('|', $request->route('role'));
        if (!$user || !$user->hasAnyRole($roles)) {
            abort(403);
        }
        return $next($request);
    }
}
