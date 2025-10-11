<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Complaints;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Complaints::with(['category', 'comments' => function ($query) {
            $query->latest();
        }])
            ->where('user_id', $user->id);

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $complaints = $query->latest()->paginate(10);
        $categories = Category::all();

        return Inertia::render('user/complaints/index', [
            'complaints' => $complaints,
            'categories' => $categories,
            'filters' => $request->only(['category_id']),
        ]);
    }

    public function create()
    {
        $categories = Category::all();

        return Inertia::render('user/complaints/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'is_anonymous' => 'boolean',
            'media' => 'nullable|array',
        ]);

        $user = auth()->user();
        $validated['user_id'] = $user->id;

        // Handle media upload if present
        if ($request->hasFile('media')) {
            $mediaFiles = [];
            foreach ($request->file('media') as $file) {
                $path = $file->store('complaint_media', 'private');
                $mediaFiles[] = [
                    'path' => $path,
                    'type' => $file->getMimeType(),
                ];
            }
            $validated['media'] = json_encode($mediaFiles);
        }

        Complaints::create($validated);

        return redirect()->route('complaints')->with('success', 'Keluhan berhasil diajukan');
    }

    public function show(Complaints $complaint)
    {
        $this->authorize('view', $complaint);

        $complaint->load(['user', 'category', 'comments.user', 'comments.quotedComment.user']);

        return Inertia::render('user/complaints/show', [
            'complaint' => $complaint,
        ]);
    }

    public function destroy(Complaints $complaint)
    {
        $this->authorize('delete', $complaint);

        // Only allow deletion if status is still pending
        if ($complaint->status !== 'pending') {
            return back()->with('error', 'Hanya keluhan yang berstatus menunggu yang dapat dihapus');
        }

        $complaint->delete();

        return redirect()->route('complaints')->with('success', 'Keluhan berhasil dihapus');
    }
}
