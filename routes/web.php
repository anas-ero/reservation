<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ReservationController;
use App\Http\Middleware\CheckRole;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 1. OWNER / PARTNER ROUTES
Route::middleware(['auth', 'role:owner'])->prefix('partner')->group(function () {
    
    // This is the route Laravel is looking for!
    Route::get('/dashboard', function () {
        return Inertia::render('OwnerDashboard'); // Connects to the React file you made
    })->name('owner.dashboard'); 
    
});

// 2. SUPER ADMIN ROUTES
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('AdminDashboard'); 
    })->name('admin.dashboard');
    
});

Route::get('/resources', [ResourceController::class, 'index']);

Route::post('/reservations', [ReservationController::class, 'store']);

Route::get('/reservations', [ReservationController::class, 'index']);
require __DIR__.'/auth.php';
