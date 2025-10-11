<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use App\Models\Complaints;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class SecureFileController extends Controller
{
    /**
     * Serve complaint media files securely
     */
    public function serveComplaintMedia(Request $request, $filename)
    {
        $user = auth()->user();
        if (!$user) {
            abort(401, 'Unauthorized');
        }

        // Find the complaint that has this media file
        $complaint = null;
        $complaints = Complaints::whereNotNull('media')->get();

        foreach ($complaints as $c) {
            $mediaArray = is_string($c->media) ? json_decode($c->media, true) : $c->media;
            if (is_array($mediaArray)) {
                foreach ($mediaArray as $mediaItem) {
                    $path = is_string($mediaItem) ? $mediaItem : ($mediaItem['path'] ?? null);
                    if ($path && str_contains($path, "complaint_media/{$filename}")) {
                        $complaint = $c;
                        break 2;
                    }
                }
            }
        }

        if (!$complaint) {
            abort(404, 'File not found');
        }        // Check if user can access this complaint
        if (!$this->canAccessComplaint($user, $complaint)) {
            abort(403, 'Access denied');
        }

        $filePath = "complaint_media/{$filename}";

        if (!Storage::disk('private')->exists($filePath)) {
            abort(404, 'File not found');
        }

        $file = Storage::disk('private')->get($filePath);
        $mimeType = mime_content_type(Storage::disk('private')->path($filePath)) ?: 'application/octet-stream';

        return response($file, 200)
            ->header('Content-Type', $mimeType)
            ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    /**
     * Serve comment media files securely
     */
    public function serveCommentMedia(Request $request, $filename)
    {
        $user = auth()->user();
        if (!$user) {
            abort(401, 'Unauthorized');
        }

        // Find the comment that has this media file
        $comment = null;
        $comments = Comments::whereNotNull('media')->get();        foreach ($comments as $c) {
            $mediaArray = is_string($c->media) ? json_decode($c->media, true) : $c->media;
            if (is_array($mediaArray)) {
                foreach ($mediaArray as $mediaItem) {
                    $path = is_string($mediaItem) ? $mediaItem : ($mediaItem['path'] ?? null);
                    if ($path && str_contains($path, "comment_media/{$filename}")) {
                        $comment = $c;
                        $comment->load('complaint');
                        break 2;
                    }
                }
            }
        }        if (!$comment) {
            abort(404, 'File not found');
        }        // Check if user can access the complaint this comment belongs to
        if (!$this->canAccessComplaint($user, $comment->complaint)) {
            abort(403, 'Access denied');
        }

        $filePath = "comment_media/{$filename}";

        if (!Storage::disk('private')->exists($filePath)) {
            abort(404, 'File not found');
        }

        $file = Storage::disk('private')->get($filePath);
        $mimeType = mime_content_type(Storage::disk('private')->path($filePath)) ?: 'application/octet-stream';

        return response($file, 200)
            ->header('Content-Type', $mimeType)
            ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    /**
     * Check if user can access a complaint
     */
    private function canAccessComplaint($user, $complaint)
    {
        // User can access if they are:
        // 1. The complaint owner
        // 2. An officer responsible for the complaint's category
        // 3. An admin

        if ($user->id === $complaint->user_id) {
            return true;
        }

        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'officer') {
            // Check if officer is responsible for this category
            return $user->categories()->where('id', $complaint->category_id)->exists();
        }

        return false;
    }
}
