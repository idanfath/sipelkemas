<?php

namespace App\Http\Controllers\Officer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $categories = Category::where('user_id', $user->id)->get();

        return Inertia::render('officer/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $user = auth()->user();

        // Check if the officer owns this category
        if ($category->user_id !== $user->id) {
            return redirect()->route('officer.categories')
                            ->with('error', 'Anda tidak memiliki akses ke kategori ini');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return back()->with('success', 'Kategori berhasil diperbarui');
    }
}
