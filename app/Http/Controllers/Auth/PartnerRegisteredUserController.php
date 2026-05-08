<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class PartnerRegisteredUserController extends Controller
{
    /**
     * Display the registration view for owners.
     */
    public function create(): Response
    {
        // This will look for a React file we are about to create
        return Inertia::render('Auth/PartnerRegister');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'business_name' => 'required|string|max:255',
            'cin_or_rc' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => 'owner',
            'is_verified' => false, // explicitly setting this to false
            'business_name' => $request->business_name,
            'cin_or_rc' => $request->cin_or_rc,
            'phone_number' => $request->phone_number,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Send them straight to the owner dashboard
        return redirect()->route('partner.pending');
    }
}