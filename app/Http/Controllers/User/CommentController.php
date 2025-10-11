<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Comments;
use App\Models\Complaints;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Complaints $complaint)
    {
        // Check if the user is authorized to view this complaint first
        $this->authorize('view', $complaint);

        // Check if the user is authorized to comment on this complaint
        if ($complaint->user_id !== auth()->id() && $complaint->status === 'resolved') {
            return back()->with('error', 'Tidak dapat menambahkan komentar pada keluhan yang telah selesai');
        }

        $validated = $request->validate([
            'comment' => 'required|string',
            'quoted_comment_id' => 'nullable|exists:comments,id',
            'media' => 'nullable|array',
        ]);

        $validated['complaint_id'] = $complaint->id;
        $validated['user_id'] = auth()->id();

        // Handle media upload if present
        if ($request->hasFile('media')) {
            $mediaFiles = [];
            foreach ($request->file('media') as $file) {
                $path = $file->store('comment_media', 'private');
                $mediaFiles[] = [
                    'path' => $path,
                    'type' => $file->getMimeType(),
                ];
            }
            $validated['media'] = json_encode($mediaFiles);
        }

        Comments::create($validated);

        return back()->with('success', 'Komentar berhasil ditambahkan');
    }

    public function destroy(Comments $comment)
    {
        // Check if the user is authorized to view the complaint first
        $this->authorize('view', $comment->complaint);

        // Check if the user is authorized to delete this comment
        if ($comment->user_id !== auth()->id()) {
            return back()->with('error', 'Anda tidak memiliki izin untuk menghapus komentar ini');
        }

        // Check if the complaint has been resolved
        if ($comment->complaint->status === 'resolved') {
            return back()->with('error', 'Tidak dapat menghapus komentar pada keluhan yang telah selesai');
        }

        $comment->delete();

        return back()->with('success', 'Komentar berhasil dihapus');
    }
}
