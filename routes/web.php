<?php

use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [StorefrontController::class, 'home'])->name('home');

Route::get('shop', [StorefrontController::class, 'shop'])->name('shop');

Route::get('wishlist', [StorefrontController::class, 'wishlist'])->name('wishlist');

Route::get('products/{slug}', [StorefrontController::class, 'product'])->name('products.show');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::get('hello', function () {
    return 'Hello World';
});