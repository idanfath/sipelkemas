import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

interface ProfilePictureUploadProps {
    currentUser: {
        id: number;
        name: string;
        email: string;
        profile_picture?: string;
        profile_picture_url?: string;
        profile_picture_or_default?: string;
    };
}

export default function ProfilePictureUpload({ currentUser }: ProfilePictureUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setMessage(null);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please select an image file' });
            return;
        }

        // Validate file size (5MB - increased for better quality before processing)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'File size must be less than 5MB' });
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('profile_picture', selectedFile);

        router.post('/profile-picture', formData, {
            forceFormData: true,
            onSuccess: () => {
                setMessage({ type: 'success', text: 'Profile picture updated successfully' });
                setPreview(null);
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: (errors) => {
                console.error('Upload errors:', errors);
                setMessage({
                    type: 'error',
                    text: errors.profile_picture || 'Failed to upload profile picture'
                });
            },
            onFinish: () => {
                setIsUploading(false);
            },
        });
    };

    const handleRemove = () => {
        setMessage(null);
        router.delete('/profile-picture', {
            onSuccess: () => {
                setMessage({ type: 'success', text: 'Profile picture removed successfully' });
            },
            onError: () => {
                setMessage({ type: 'error', text: 'Failed to remove profile picture' });
            },
        });
    };

    const handleCancel = () => {
        setPreview(null);
        setSelectedFile(null);
        setMessage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const currentPictureUrl = preview || currentUser.profile_picture_or_default;
    const hasCustomPicture = currentUser.profile_picture;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Profile Picture
                </CardTitle>
                <CardDescription>
                    Upload a profile picture to personalize your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {message && (
                    <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                        {message.type === 'error' ? (
                            <AlertCircle className="h-4 w-4" />
                        ) : (
                            <CheckCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={currentPictureUrl} alt={currentUser.name} />
                        <AvatarFallback className="text-lg">
                            {currentUser.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-center space-y-2">
                        <Label htmlFor="profile-picture" className="sr-only">
                            Profile Picture
                        </Label>
                        <Input
                            ref={fileInputRef}
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {!preview && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Choose Photo
                            </Button>
                        )}

                        {preview && (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="flex items-center gap-2"
                                >
                                    <Upload className="h-4 w-4" />
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancel}
                                    disabled={isUploading}
                                    className="flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                            </div>
                        )}

                        {hasCustomPicture && !preview && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleRemove}
                                className="flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                Remove Photo
                            </Button>
                        )}
                    </div>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                    <p>Images will be automatically cropped to square, max 5MB</p>
                    <p>Supported formats: JPG, PNG, GIF</p>
                </div>
            </CardContent>
        </Card>
    );
}
