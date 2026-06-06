<?php

use App\Http\Controllers\HeroController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\Partner\PartnerResourceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ResourceController;
use App\Http\Middleware\CheckOwnerVerified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\PartnerRegisteredUserController;
use App\Http\Controllers\RatingController;

Route::get('/', [HeroController::class, 'index'])->name('home');

// --- GENERIC DASHBOARD (With Backdoor Protection) ---
Route::get('/dashboard', function (Request $request) {
    // 🛑 ADD THIS LINE RIGHT HERE:

    // If they are an Admin, kick them to Admin Dashboard
    if ($request->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    // If they are an Owner, kick them to the Partner Dashboard (which will then check if they are pending)
    if ($request->user()->role === 'owner') {
        return redirect()->route('owner.dashboard');
    }

    // Default for Customers
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// --- PROFILE ROUTES ---
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --- 1. PARTNER/OWNER ROUTES ---

// A. The "Limbo" Route (Only requires auth and 'owner' role)
Route::middleware(['auth', 'role:owner'])->prefix('partner')->group(function () {
    Route::get('/pending-approval', function () {
        return Inertia::render('Partner/PendingApproval');
    })->name('partner.pending');
});

// B. The REAL Dashboard (100% Protected by CheckOwnerVerified)
Route::middleware(['auth', 'role:owner', CheckOwnerVerified::class])->prefix('partner')->group(function () {
    Route::get('/dashboard', [OwnerController::class, 'dashboard'])->name('owner.dashboard');

    Route::resource('/resources', PartnerResourceController::class)->names(
        'partner.resources'
    );
});

// --- 2. SUPER ADMIN ROUTES ---
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('AdminDashboard');
    })->name('admin.dashboard');
});

// --- 3. PUBLIC APP ROUTES ---
Route::get('/resources', [ResourceController::class, 'index'])->name('public.resources.index');

// Add this line for the new Public Show page!
Route::get('/resources/{resource}', [ResourceController::class, 'show'])->name('public.resources.show');
// Your existing reservation routes...
Route::post('/reservations', [ReservationController::class, 'store'])->middleware('auth');
Route::post('/resources/{resource}/ratings', [RatingController::class, 'store'])->middleware('auth')->name('ratings.store');
Route::get('/reservations', [ReservationController::class, 'index']);


require __DIR__.'/auth.php';
