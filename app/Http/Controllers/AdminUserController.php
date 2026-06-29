<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Optional filter by role (e.g., ?role=owner)
        if ($request->has('role') && in_array($request->role, ['customer', 'owner', 'admin'])) {
            $query->where('role', $request->role);
        }

        // Search by name or email
        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Fetch users and eager load their resource count (if they are owners)
        $users = $query->withCount('resources')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['role', 'search'])
        ]);
    }

    public function destroy(User $user)
    {
        // Optional: prevent deleting the currently authenticated admin
        if (auth()->id() === $user->id) {
            return back()->with('error', 'You cannot delete yourself.');
        }

        $user->delete();

        return back()->with('success', 'User has been removed successfully.');
    }
}
