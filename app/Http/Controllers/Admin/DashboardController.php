<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Complaints;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function reports(Request $request)
    {
        $query = Complaints::with(['category', 'user']);

        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $complaints = $query->paginate(15);
        $categories = Category::all();

        return Inertia::render('admin/complaints/index', [
            'complaints' => $complaints,
            'categories' => $categories,
            'filters' => $request->only(['start_date', 'end_date', 'category_id', 'status']),
        ]);
    }
}
