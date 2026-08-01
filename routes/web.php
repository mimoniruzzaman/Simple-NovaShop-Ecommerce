<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('shop', function () {
    return Inertia::render('Home');
})->name('shop');

Route::get('wishlist', function () {
    return Inertia::render('Wishlist');
})->name('wishlist');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::get('hello', function () {
    return 'Hello World';
});