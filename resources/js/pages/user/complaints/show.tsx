import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { adminComplaints, officerComplaints, userComplaints } from '@/routes';
import { router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { AlertCircle, ArrowLeft, Clock, FileText, Image, Loader2, PaperclipIcon, Send, User, X, XCircle, CheckCircle, PlayCircle } from 'lucide-react';
import { useState } from 'react';

function getStatusBadgeClass(status: string) {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'in_progress':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'resolved':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
}

function getStatusText(status: string) {
    switch (status) {
        case 'pending':
            return 'Menunggu';
        case 'in_progress':
            return 'Diproses';
        case 'resolved':
            return 'Selesai';
        default:
            return 'Unknown';
    }
}

interface Media {
    path: string;
    type: string;
}

// Helper function to normalize media data
function normalizeMedia(media: any): Media {
    if (typeof media === 'string') {
        // Old format: just a string path
        return {
            path: media,
            type: media.toLowerCase().includes('.jpg') ||
                media.toLowerCase().includes('.jpeg') ||
                media.toLowerCase().includes('.png') ||
                media.toLowerCase().includes('.gif') ||
                media.toLowerCase().includes('.webp') ? 'image' : 'file'
        };
    }
    // New format: object with path and type
    return media;
}

// Helper function to get media array from various formats
function getMediaArray(media: any): Media[] {
    if (!media) return [];

    // If it's already an array, return it
    if (Array.isArray(media)) return media;

    // If it's a string (JSON), try to parse it
    if (typeof media === 'string') {
        try {
            const parsed = JSON.parse(media);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    return [];
}

// Helper function to generate secure media URL
function getSecureMediaUrl(mediaPath: string): string {
    if (mediaPath.startsWith('complaint_media/')) {
        const filename = mediaPath.replace('complaint_media/', '');
        return `/secure/complaint-media/${filename}`;
    } else if (mediaPath.startsWith('comment_media/')) {
        const filename = mediaPath.replace('comment_media/', '');
        return `/secure/comment-media/${filename}`;
    }
    return mediaPath;
}

interface User {
    id: number;
    name: string;
    profile_picture: string | null;
    role: string;
}

interface Comment {
    id: number;
    user_id: number;
    comment: string;
    media: (Media | string)[] | null; // Can be either array of Media objects or strings
    created_at: string;
    user: User;
    quoted_comment: Comment | null;
}

interface Category {
    id: number;
    name: string;
}

interface Complaint {
    id: number;
    user_id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved';
    media: (Media | string)[] | null; // Can be either array of Media objects or strings
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
    category: Category;
    user: User;
    comments: Comment[];
}

interface ComplaintShowProps {
    complaint: Complaint;
    auth: {
        user: User;
    };
}

export default function ComplaintShow({ complaint, auth }: ComplaintShowProps) {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [quotedComment, setQuotedComment] = useState<Comment | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        comment: '',
        quoted_comment_id: null as number | null,
        media: [] as File[],
    });

    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const isOfficer = auth.user.role === 'officer';
    const isAdmin = auth.user.role === 'admin';
    const canUpdateStatus = (isOfficer || isAdmin);

    const handleStatusUpdate = (newStatus: 'pending' | 'in_progress' | 'resolved') => {
        setIsUpdatingStatus(true);

        // Use router.patch directly for status update
        router.patch(`/complaints/${complaint.id}/status`,
            { status: newStatus },
            {
                onSuccess: () => {
                    // The page should be updated automatically by Inertia
                    setIsUpdatingStatus(false);
                },
                onError: (errors) => {
                    console.error('Status update failed:', errors);
                    setIsUpdatingStatus(false);
                },
                preserveState: false,
                preserveScroll: true,
            }
        );
    }; const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create FormData for file uploads
        const formData = new FormData();
        formData.append('comment', data.comment);

        if (data.quoted_comment_id) {
            formData.append('quoted_comment_id', data.quoted_comment_id.toString());
        }

        // Add files if any
        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach((file, index) => {
                formData.append(`media[${index}]`, file);
            });
        }

        post(`/complaints/${complaint.id}/comments`, {
            // TANDA
            ...formData,
            onSuccess: () => {
                reset('comment');
                setUploadedFiles([]);
                setQuotedComment(null);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setUploadedFiles((prev) => [...prev, ...files]);
            setData('media', [...data.media, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const quoteComment = (comment: Comment) => {
        setQuotedComment(comment);
        setData('quoted_comment_id', comment.id);
    };

    const cancelQuote = () => {
        setQuotedComment(null);
        setData('quoted_comment_id', null);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const canAddComment = complaint.status !== 'resolved';

    return (
        <AppShell variant="header">
            <AppHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    {
                        title: (isOfficer || isAdmin) ? 'Keluhan Yang Ditangani' : 'Keluhan Saya',
                        href: isOfficer ? '/officer/complaints' : isAdmin ? '/admin/complaints' : '/complaints'
                    },
                    { title: 'Detail Keluhan', href: `/complaints/${complaint.id}` },
                ]}
            />
            <AppContent>
                <div className="space-y-6 mt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => router.visit(isOfficer ? officerComplaints() : isAdmin ? adminComplaints() : userComplaints())}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Detail Keluhan
                            </h2>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(
                                    complaint.status,
                                )}`}
                            >
                                {getStatusText(complaint.status)}
                            </div>
                            {canUpdateStatus && (
                                <div className="flex items-center space-x-2">
                                    <Select
                                        value={complaint.status}
                                        onValueChange={handleStatusUpdate}
                                        disabled={isUpdatingStatus}
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Ubah Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 text-yellow-600" />
                                                    <span>Menunggu</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="in_progress">
                                                <div className="flex items-center space-x-2">
                                                    <PlayCircle className="h-4 w-4 text-blue-600" />
                                                    <span>Diproses</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="resolved">
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    <span>Selesai</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {isUpdatingStatus && (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl">
                                        {complaint.title}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Kategori:{' '}
                                        <span className="font-medium text-foreground">
                                            {complaint.category.name}
                                        </span>
                                        <span className="mx-2">•</span>
                                        Diajukan pada:{' '}
                                        <span className="font-medium text-foreground">
                                            {format(
                                                new Date(complaint.created_at),
                                                'dd MMM yyyy HH:mm',
                                            )}
                                        </span>
                                        {complaint.updated_at !== complaint.created_at && (
                                            <>
                                                <span className="mx-2">•</span>
                                                Diperbarui pada:{' '}
                                                <span className="font-medium text-foreground">
                                                    {format(
                                                        new Date(complaint.updated_at),
                                                        'dd MMM yyyy HH:mm',
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <Avatar className="h-10 w-10 rounded-full border">
                                    <AvatarImage
                                        src={
                                            !complaint.is_anonymous
                                                ? complaint.user.profile_picture || undefined
                                                : undefined
                                        }
                                        alt="User"
                                    />
                                    <AvatarFallback>
                                        {!complaint.is_anonymous
                                            ? getInitials(complaint.user.name)
                                            : 'AN'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="mb-1 flex items-center space-x-2">
                                        <span className="font-medium">
                                            {!complaint.is_anonymous
                                                ? complaint.user.name
                                                : 'Anonim'}
                                        </span>
                                    </div>
                                    <div className="prose max-w-none text-sm dark:prose-invert">
                                        <p>{complaint.description}</p>
                                    </div>

                                    {(() => {
                                        const mediaArray = getMediaArray(complaint.media);
                                        return mediaArray.length > 0 ? (
                                            <div className="mt-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {mediaArray.map(
                                                        (mediaItem, index) => {
                                                            const media = normalizeMedia(mediaItem);
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={getSecureMediaUrl(media.path)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 rounded-md border bg-muted px-3 py-1 text-sm"
                                                                >
                                                                    {media.type.includes(
                                                                        'image',
                                                                    ) ? (
                                                                        <Image className="h-4 w-4" />
                                                                    ) : (
                                                                        <FileText className="h-4 w-4" />
                                                                    )}
                                                                    Attachment {index + 1}
                                                                </a>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        ) : null;
                                    })()}
                                </div>
                            </div>

                            <div className="relative mt-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-card px-2 text-sm text-muted-foreground">
                                        Komentar
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {complaint.comments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                                        <div className="rounded-full bg-muted p-3">
                                            <AlertCircle className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <h3 className="mt-2 font-medium">
                                            Belum Ada Komentar
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada komentar pada keluhan ini
                                        </p>
                                    </div>
                                ) : (
                                    complaint.comments.map((comment) => (
                                        <div key={comment.id} className="space-y-4">
                                            <div className="flex items-start space-x-4">
                                                <Avatar className="h-8 w-8 rounded-full border">
                                                    <AvatarImage
                                                        src={comment.user.profile_picture || undefined}
                                                        alt={comment.user.name}
                                                    />
                                                    <AvatarFallback>
                                                        {getInitials(comment.user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="rounded-lg bg-muted p-4">
                                                        <div className="mb-1 flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-medium">
                                                                    {comment.user.name}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {comment.user.role !== 'user' && (
                                                                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                                                                            {comment.user.role.charAt(0).toUpperCase() + comment.user.role.slice(1)}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {format(
                                                                    new Date(comment.created_at),
                                                                    'dd MMM yyyy HH:mm',
                                                                )}
                                                            </span>
                                                        </div>

                                                        {comment.quoted_comment && (
                                                            <div className="mb-2 rounded border-l-2 border-primary bg-muted/50 p-2 text-sm">
                                                                <div className="mb-1 text-xs font-medium">
                                                                    {comment.quoted_comment.user?.name || 'Unknown User'} menulis:
                                                                </div>
                                                                <p className="text-muted-foreground">
                                                                    {comment.quoted_comment.comment.length > 100
                                                                        ? `${comment.quoted_comment.comment.substring(0, 100)}...`
                                                                        : comment.quoted_comment.comment}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <p>{comment.comment}</p>

                                                        {(() => {
                                                            const mediaArray = getMediaArray(comment.media);
                                                            return mediaArray.length > 0 ? (
                                                                <div className="mt-2 flex flex-wrap gap-2">
                                                                    {mediaArray.map((mediaItem, index) => {
                                                                        const media = normalizeMedia(mediaItem);
                                                                        return (
                                                                            <a
                                                                                key={index}
                                                                                href={getSecureMediaUrl(media.path)}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex items-center gap-1 rounded-md bg-background px-2 py-1 text-xs"
                                                                            >
                                                                                {media.type.includes('image') ? (
                                                                                    <Image className="h-3 w-3" />
                                                                                ) : (
                                                                                    <FileText className="h-3 w-3" />
                                                                                )}
                                                                                Attachment {index + 1}
                                                                            </a>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : null;
                                                        })()}
                                                    </div>

                                                    {canAddComment && (
                                                        <div className="mt-1 flex items-center justify-end space-x-2">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => quoteComment(comment)}
                                                                className="h-auto px-2 py-1 text-xs"
                                                            >
                                                                Balas
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        {canAddComment && (
                            <CardFooter>
                                <form onSubmit={handleSubmit} className="w-full space-y-4">
                                    {quotedComment && (
                                        <div className="relative rounded-lg border border-muted bg-muted/50 p-3 pr-10">
                                            <div className="mb-1 text-xs font-medium">
                                                Membalas komentar dari {quotedComment.user.name}:
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {quotedComment.comment.length > 100
                                                    ? `${quotedComment.comment.substring(0, 100)}...`
                                                    : quotedComment.comment}
                                            </p>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1 h-6 w-6"
                                                onClick={cancelQuote}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}

                                    <div className="grid w-full gap-2">
                                        <Textarea
                                            placeholder="Tulis komentar Anda di sini..."
                                            value={data.comment}
                                            onChange={(e) => setData('comment', e.target.value)}
                                            className="min-h-32"
                                        />
                                        {errors.comment && (
                                            <p className="text-sm text-destructive">{errors.comment}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <input
                                                type="file"
                                                multiple
                                                id="comment-files"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    document.getElementById('comment-files')?.click()
                                                }
                                            >
                                                <PaperclipIcon className="mr-2 h-4 w-4" />
                                                Lampirkan File
                                            </Button>
                                            {uploadedFiles.length > 0 && (
                                                <span className="ml-2 text-sm">
                                                    {uploadedFiles.length} file dipilih
                                                </span>
                                            )}
                                        </div>
                                        <Button type="submit" disabled={processing || !data.comment}>
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Mengirim...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Kirim Komentar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </AppContent>
        </AppShell>
    );
}
