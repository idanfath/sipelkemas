<?php

namespace App\Http\Controllers;

use App\Models\Complaints;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $stats = $this->getStats($user);
        $latestComplaints = $this->getLatestComplaints($user);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'latestComplaints' => $latestComplaints,
        ]);
    }

    private function getStats($user)
    {
        $stats = [];

        // Get different stats based on user role
        if ($user->role === 'admin') {
            $stats = [
                'totalComplaints' => Complaints::count(),
                'pendingComplaints' => Complaints::where('status', 'pending')->count(),
                'inProgressComplaints' => Complaints::where('status', 'in_progress')->count(),
                'resolvedComplaints' => Complaints::where('status', 'resolved')->count(),
                'totalUsers' => User::where('role', 'user')->count(),
            ];
        } elseif ($user->role === 'officer') {
            $stats = [
                'pendingComplaints' => Complaints::where('status', 'pending')->count(),
                'inProgressComplaints' => Complaints::where('status', 'in_progress')->count(),
                'resolvedComplaints' => Complaints::where('status', 'resolved')->count(),
            ];
        } else { // user role
            $stats = [
                'totalComplaints' => Complaints::where('user_id', $user->id)->count(),
                'pendingComplaints' => Complaints::where('user_id', $user->id)->where('status', 'pending')->count(),
                'inProgressComplaints' => Complaints::where('user_id', $user->id)->where('status', 'in_progress')->count(),
                'resolvedComplaints' => Complaints::where('user_id', $user->id)->where('status', 'resolved')->count(),
            ];
        }

        return $stats;
    }

    private function getLatestComplaints($user)
    {
        // For user: get their complaints
        // For officer: get complaints that need attention (pending first)
        // For admin: get most recent complaints

        $query = Complaints::with(['category', 'user']);

        if ($user->role === 'user') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'officer') {
            // Officers are interested in pending complaints first
            // $query->orderByRaw("FIELD(status, 'pending', 'in_progress', 'resolved')");
            // Temporary sqlite compatible query
            $query->orderByRaw("CASE
                WHEN status = 'pending' THEN 1
                WHEN status = 'in_progress' THEN 2
                WHEN status = 'resolved' THEN 3
                ELSE 4
            END");
        }

        // Get the latest complaints
        $latestComplaints = $query->latest()
            ->take(5)
            ->get()
            ->map(function ($complaint) {
                return [
                    'id' => $complaint->id,
                    'title' => $complaint->title,
                    'date' => Carbon::parse($complaint->created_at)->format('d F Y'),
                    'status' => $complaint->status,
                    'userName' => $complaint->is_anonymous ? 'Anonymous' : $complaint->user->name,
                    'categoryName' => $complaint->category->name,
                ];
            });

        return $latestComplaints;
    }
}
