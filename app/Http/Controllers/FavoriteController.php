<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'resource_id' => 'required|exists:resources,id'
        ]);

        $user = $request->user();
        
        $favorite = Favorite::where('user_id', $user->id)
            ->where('resource_id', $validated['resource_id'])
            ->first();

        if ($favorite) {
            $favorite->delete();
            return back()->with('success', 'Removed from favorites.');
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'resource_id' => $validated['resource_id']
            ]);
            return back()->with('success', 'Added to favorites.');
        }
    }
}
