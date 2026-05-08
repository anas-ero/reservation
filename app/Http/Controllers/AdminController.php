<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    public function approvePartner(Request $request, User $user)
    {
        // Flip the boolean
        $user->update(['is_verified' => true]);

        // Optional: Send them an email letting them know they are approved!
        // Mail::to($user->email)->send(new PartnerApprovedMail());

        return back()->with('success', 'Partner has been approved and can now create listings.');
    }
}
