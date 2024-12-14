<?php

namespace App\Http\Controllers;
use App\Models\Product;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(){
        return Inertia::render('Index');
    }
    public function fetchProducts(){
        $products = Product::paginate(10); // Fetch paginated products
        return response()->json($products);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        $path = $request->file('image')?->store('images', 'public');

        $product = Product::updateOrCreate(array_merge($validated, ['image' => $path]));
        return  response()->json($product, 201);
    }

    public function update(Request $request, Product $product){
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
            'stock' => 'sometimes|required|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        if($request->hasFile('image')) {
            Storage::delete('public/' . $product->image);
            $validated['image'] = $request->file('image')->store('images', 'public');
        }

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy(Product $product){
        Storage::delete('public/' . $product->image);
        $product->delete();
        return response()->noContent();
    }
}
