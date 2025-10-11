<?php

use App\Http\Controllers\Admin\CategoryManagementController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Officer\CategoryController;
use App\Http\Controllers\Officer\OfficerComplaintController;
use App\Http\Controllers\User\CommentController;
use App\Http\Controllers\User\ComplaintController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\ProfilePictureController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [WelcomeController::class, 'index'])->name('home');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Secure file serving routes
    Route::get('/secure/complaint-media/{filename}', [App\Http\Controllers\SecureFileController::class, 'serveComplaintMedia'])
        ->name('secure.complaint-media')
        ->where('filename', '.*');
    Route::get('/secure/comment-media/{filename}', [App\Http\Controllers\SecureFileController::class, 'serveCommentMedia'])
        ->name('secure.comment-media')
        ->where('filename', '.*');

    // Dashboard route for all authenticated users
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Profile picture routes
    Route::post('/profile-picture', [ProfilePictureController::class, 'upload'])->name('profile-picture.upload');
    Route::delete('/profile-picture', [ProfilePictureController::class, 'destroy'])->name('profile-picture.destroy');
    Route::get('/profile-picture/{userId?}', [ProfilePictureController::class, 'show'])->name('profile-picture.show');

    // User routes
    Route::middleware('role:user')->group(function () {
        Route::get('/complaints', [ComplaintController::class, 'index'])->name('complaints');
        Route::delete('/complaints/{complaint}', [ComplaintController::class, 'destroy'])->name('complaints.destroy');
        Route::post('/complaints', [ComplaintController::class, 'store'])->name('complaints.store');
        Route::get('/complaints/create', [ComplaintController::class, 'create'])->name('complaints.create');
    });

    Route::middleware('role:user,officer,admin')->group(function () {
        Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
        Route::get('/complaints/{complaint}', [ComplaintController::class, 'show'])->name('complaints.show');
        Route::post('/complaints/{complaint}/comments', [CommentController::class, 'store'])->name('comments.store');
    });

    Route::middleware('role:officer,admin')->group(function () {
        Route::patch('/complaints/{complaint}/status', [OfficerComplaintController::class, 'updateStatus'])->name('complaints.update-status');
    });

    // Officer routes
    Route::middleware('role:officer')->prefix('officer')->name('officer.')->group(function () {
        // Complaint management
        Route::get('/complaints', [OfficerComplaintController::class, 'index'])->name('complaints');

        // Category management
        Route::get('/categories', [CategoryController::class, 'index'])->name('categories');
        Route::patch('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    });

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/complaints', [AdminDashboardController::class, 'reports'])->name('reports');
        // User management
        Route::get('/users', [UserManagementController::class, 'index'])->name('users');
        Route::get('/users/create', [UserManagementController::class, 'create'])->name('users.create');
        Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
        Route::get('/users/{user}/edit', [UserManagementController::class, 'edit'])->name('users.edit');
        Route::patch('/users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');

        // Category management
        Route::get('/categories', [CategoryManagementController::class, 'index'])->name('categories');
        Route::post('/categories', [CategoryManagementController::class, 'store'])->name('categories.store');
        Route::patch('/categories/{category}', [CategoryManagementController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [CategoryManagementController::class, 'destroy'])->name('categories.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
