<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\File;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Inertia\Inertia;

class ProfilePictureController extends Controller
{
    /**
     * Upload or update profile picture
     */
    public function upload(Request $request)
    {
        $request->validate([
            'profile_picture' => [
                'required',
                File::image()
                    ->max(5120), // 5MB - increased since we'll be processing the image
            ],
        ]);

        $user = Auth::user();

        // Delete old profile picture if exists
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        // Process and store the image
        $file = $request->file('profile_picture');
        $filename = 'profile-' . $user->id . '-' . time() . '.jpg';
        $path = 'profile-pictures/' . $filename;

        // Initialize Image Manager
        $manager = new ImageManager(new Driver());

        // Load image and crop to square (centered)
        $image = $manager->read($file->getPathname());

        // Get dimensions
        $width = $image->width();
        $height = $image->height();

        // Calculate the crop size (use the smaller dimension)
        $cropSize = min($width, $height);

        // Calculate crop position (centered)
        $cropX = ($width - $cropSize) / 2;
        $cropY = ($height - $cropSize) / 2;

        // Crop to square and resize to 300x300
        $image = $image
            ->crop($cropSize, $cropSize, (int)$cropX, (int)$cropY)
            ->resize(300, 300);

        // Store the processed image
        Storage::disk('public')->put($path, $image->toJpeg(85)); // 85% quality        // Update user record
        $user->update(['profile_picture' => $path]);

        return back()->with('success', 'Profile picture updated successfully');
    }

    /**
     * Delete profile picture
     */
    public function destroy()
    {
        $user = Auth::user();

        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
            $user->update(['profile_picture' => null]);
        }

        return back()->with('success', 'Profile picture removed successfully');
    }

    /**
     * Get profile picture URL
     */
    public function show($userId = null)
    {
        $user = $userId ? \App\Models\User::findOrFail($userId) : Auth::user();

        return response()->json([
            'profile_picture_url' => $user->profile_picture_or_default,
            'has_custom_picture' => !is_null($user->profile_picture),
        ]);
    }
}
