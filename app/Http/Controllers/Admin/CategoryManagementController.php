<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryManagementController extends Controller
{
    public function index()
    {
        $categories = Category::with('officer')->paginate(10);
        $officers = User::where('role', 'officer')->get();

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'officers' => $officers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
        ]);

        // Check if the assigned user is actually an officer
        $user = User::find($validated['user_id']);
        if ($user->role !== 'officer') {
            return back()->with('error', 'Kategori hanya dapat ditetapkan ke petugas');
        }

        Category::create($validated);

        return back()->with('success', 'Kategori berhasil ditambahkan');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
        ]);

        // Check if the assigned user is actually an officer
        $user = User::find($validated['user_id']);
        if ($user->role !== 'officer') {
            return back()->with('error', 'Kategori hanya dapat ditetapkan ke petugas');
        }

        $category->update($validated);

        return back()->with('success', 'Kategori berhasil diperbarui');
    }

    public function destroy(Category $category)
    {
        // Check if there are complaints in this category
        $hasComplaints = $category->complaints()->exists();

        if ($hasComplaints) {
            return back()->with('error', 'Tidak dapat menghapus kategori yang memiliki keluhan');
        }

        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus');
    }
}
