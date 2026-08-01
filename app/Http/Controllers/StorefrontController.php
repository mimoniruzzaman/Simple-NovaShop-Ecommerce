<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home');
    }

    public function shop(): Response
    {
        return Inertia::render('Home');
    }

    public function wishlist(): Response
    {
        return Inertia::render('Wishlist');
    }

    public function product(string $slug): Response
    {
        return Inertia::render('ProductDetails', ['slug' => $slug]);
    }
}
