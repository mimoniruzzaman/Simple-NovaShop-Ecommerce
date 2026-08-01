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
        return Inertia::render('Shop');
    }

    public function wishlist(): Response
    {
        return Inertia::render('Wishlist');
    }

    public function cart(): Response
    {
        return Inertia::render('Cart');
    }

    public function checkout(): Response
    {
        return Inertia::render('Checkout');
    }

    public function product(string $slug): Response
    {
        return Inertia::render('ProductDetails', ['slug' => $slug]);
    }
}
