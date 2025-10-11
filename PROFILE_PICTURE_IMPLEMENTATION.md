# Profile Picture Feature Implementation

## Overview
This implementation adds profile picture functionality to the existing user system, allowing users to upload, update, and remove their profile pictures.

## Backend Implementation

### 1. Database
- The `profile_picture` column already exists in the `users` table as a nullable string field

### 2. User Model (`app/Models/User.php`)
- Added `profile_picture` to the `$fillable` array
- Added accessor methods:
  - `getProfilePictureUrlAttribute()`: Returns the full URL for the profile picture
  - `getDefaultProfilePictureAttribute()`: Returns a UI Avatars URL with user initials
  - `getProfilePictureOrDefaultAttribute()`: Returns custom picture URL or default
- Added `$appends` array to automatically include these attributes in JSON serialization

### 3. Controller (`app/Http/Controllers/ProfilePictureController.php`)
- `upload()`: Handles profile picture upload with validation and automatic cropping
  - Validates file type and size (max 5MB)
  - Automatically crops images to square (centered) using Intervention Image
  - Resizes final image to 300x300px for consistency
  - Saves as JPEG with 85% quality for optimal file size
- `destroy()`: Removes the current profile picture
- `show()`: Returns profile picture information for a user

### 4. Routes (`routes/web.php`)
- `POST /profile-picture`: Upload/update profile picture
- `DELETE /profile-picture`: Remove profile picture
- `GET /profile-picture/{userId?}`: Get profile picture info

### 5. Middleware (`app/Http/Middleware/HandleInertiaRequests.php`)
- Updated to include profile picture attributes in shared user data

## Key Components

### UserAvatar Component (`resources/js/components/user-avatar.tsx`)
- Reusable component for displaying user avatars consistently
- Automatically uses profile pictures when available
- Falls back to generated initials when no profile picture is set
- Supports multiple sizes (sm, md, lg, xl)
- Handles both full User objects and partial user data

### ProfilePictureUpload Component (`resources/js/components/profile-picture-upload.tsx`)
- Dedicated component for profile picture management
- File selection with validation
- Image preview before upload
- Upload progress indication
- Error and success message handling

### 2. Integration
- Added to profile settings page (`resources/js/pages/settings/profile.tsx`)
- Created reusable `UserAvatar` component for consistent avatar display across the app
- Updated user avatars throughout the application:
  - App header navigation
  - User info component (used in sidebar and user listings)
  - Complaint and comment displays
  - All avatar components now use profile pictures when available, falling back to generated initials

### 3. Type Definitions (`resources/js/types/index.d.ts`)
- Updated User interface to include profile picture properties

## File Storage
- Profile pictures are stored in `storage/app/public/profile-pictures/`
- Files are publicly accessible via the `/storage` symlink
- Old profile pictures are automatically deleted when new ones are uploaded

## Validation Rules
- **File Type**: Must be an image (jpg, png, gif, etc.)
- **File Size**: Maximum 5MB (increased to allow for better quality before processing)
- **Processing**: Images are automatically cropped to square (centered) and resized to 300x300px
- **Required**: No, profile pictures are optional

## Image Processing
- **Automatic Cropping**: All uploaded images are automatically cropped to square using center crop
- **Resizing**: Final images are resized to 300x300px for consistency
- **Quality**: JPEG compression at 85% quality for optimal balance of quality and file size
- **Format**: All profile pictures are saved as JPEG regardless of input format

## Default Profile Pictures
- Uses UI Avatars service (https://ui-avatars.com) for default profile pictures
- Generates avatar based on user's name initials
- Consistent color scheme across the application

## Usage

### For Users
1. Navigate to Profile Settings
2. Click "Choose Photo" in the Profile Picture section
3. Select any image file (max 5MB) - it will be automatically cropped to square
4. Preview the image and click "Upload"
5. Remove existing pictures with "Remove Photo" button

### For Developers
```php
// Get user's profile picture URL
$user->profile_picture_url

// Get default avatar URL
$user->default_profile_picture

// Get profile picture or fallback to default
$user->profile_picture_or_default
```

## Security Considerations
- File type validation prevents malicious uploads
- File size limits prevent storage abuse
- Images are stored in the public storage area (safe for display)
- User authorization ensures users can only manage their own pictures

## Future Enhancements
- Image resizing/cropping functionality
- Multiple image format optimization
- CDN integration for better performance
- Admin controls for profile picture moderation
