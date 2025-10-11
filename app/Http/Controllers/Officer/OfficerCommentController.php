<?php

namespace App\Http\Controllers\Officer;

use App\Http\Controllers\Controller;
use App\Models\Comments;
use App\Models\Complaints;
use Illuminate\Http\Request;

class OfficerCommentController extends Controller
{
    public function store(Request $request, Complaints $complaint)
    {
        $user = auth()->user();

        // Check if the officer is responsible for this category
        $canManage = $complaint->category->user_id === $user->id;

        if (!$canManage) {
            return redirect()->route('officer.complaints')
                            ->with('error', 'Anda tidak memiliki akses ke keluhan ini');
        }

        // Check if the complaint is resolved
        if ($complaint->status === 'resolved') {
            return back()->with('error', 'Tidak dapat menambahkan komentar pada keluhan yang telah selesai');
        }

        $validated = $request->validate([
            'comment' => 'required|string',
            'quoted_comment_id' => 'nullable|exists:comments,id',
            'media' => 'nullable|array',
        ]);

        $validated['complaint_id'] = $complaint->id;
        $validated['user_id'] = $user->id;

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
}
