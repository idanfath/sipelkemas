<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Complaints;
use App\Models\User;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        // Get actual statistics from the database
        $totalComplaints = Complaints::count();
        $resolvedComplaints = Complaints::where('status', 'resolved')->count();
        $pendingComplaints = Complaints::where('status', 'pending')->count();
        $inProgressComplaints = Complaints::where('status', 'in_progress')->count();

        $totalStudents = User::where('role', 'user')->count();
        $totalOfficers = User::where('role', 'officer')->count();
        $totalCategories = Category::count();

        // Calculate satisfaction rate (resolved complaints as percentage of total)
        $satisfactionRate = $totalComplaints > 0 ? round(($resolvedComplaints / $totalComplaints) * 100) : 0;

        // Get recent complaints (limit to 3) for showcase
        $recentComplaints = Complaints::with(['category', 'user'])
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($complaint) {
                return [
                    'id' => $complaint->id,
                    'title' => $complaint->title,
                    'category' => $complaint->category->name,
                    'status' => $complaint->status,
                    'is_anonymous' => $complaint->is_anonymous,
                    'created_at' => $complaint->created_at->format('d M Y'),
                ];
            });

        // Get categories with complaint counts
        $categoriesWithCounts = Category::withCount('complaints')
            ->orderBy('complaints_count', 'desc')
            ->limit(16)
            ->get()
            ->map(function ($category) {
            return [
                'name' => $category->name,
                'count' => $category->complaints_count,
            ];
            });

        $stats = [
            'totalComplaints' => $totalComplaints,
            'resolvedComplaints' => $resolvedComplaints,
            'pendingComplaints' => $pendingComplaints,
            'inProgressComplaints' => $inProgressComplaints,
            'totalStudents' => $totalStudents,
            'totalOfficers' => $totalOfficers,
            'totalCategories' => $totalCategories,
            'satisfactionRate' => $satisfactionRate,
            'recentComplaints' => $recentComplaints,
            'categoriesWithCounts' => $categoriesWithCounts,
        ];

        return Inertia::render('welcome', [
            'stats' => $stats,
        ]);
    }
}
