<?php

namespace App\Http\Controllers\Officer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Complaints;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfficerComplaintController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Get categories managed by this officer
        $officerCategories = Category::where('user_id', $user->id)->pluck('id');

        $query = Complaints::with(['category', 'user', 'comments' => function ($query) {
            $query->latest();
        }])->whereIn('category_id', $officerCategories);

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $complaints = $query->latest()->paginate(10);
        $categories = Category::whereIn('id', $officerCategories)->get();

        return Inertia::render('officer/complaints/index', [
            'complaints' => $complaints,
            'categories' => $categories,
            'filters' => $request->only(['category_id', 'status']),
        ]);
    }

    public function updateStatus(Request $request, Complaints $complaint)
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            // Check if the officer is responsible for this category
            $canManage = Category::where('user_id', $user->id)
                ->where('id', $complaint->category_id)
                ->exists();

            if (! $canManage) {
                return redirect()->route('officer.complaints')
                    ->with('error', 'Anda tidak memiliki akses ke keluhan ini');
            }
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,resolved',
        ]);

        $complaint->update(['status' => $validated['status']]);

        return back()->with('success', 'Status keluhan berhasil diperbarui');
    }
}
