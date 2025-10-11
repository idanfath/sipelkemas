import { useState } from 'react';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowLeft, AlertCircle } from 'lucide-react';

import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserAvatar } from '@/components/user-avatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/status-badge';
import { StatusSelector } from '@/components/status-selector';
import { MediaAttachments } from '@/components/media-attachments';
import { CommentItem } from '@/components/comment-item';
import { CommentForm } from '@/components/comment-form';

import { adminComplaints, officerComplaints, userComplaints } from '@/routes';
import { User, Comment, Category, Complaint } from '@/types';

interface ComplaintShowProps {
    complaint: Complaint;
    auth: { user: User };
}

export default function ComplaintShow({ complaint, auth }: ComplaintShowProps) {
    const [quotedComment, setQuotedComment] = useState<Comment | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const isOfficer = auth.user.role === 'officer';
    const isAdmin = auth.user.role === 'admin';
    const canUpdateStatus = isOfficer || isAdmin;
    const canAddComment = complaint.status !== 'resolved';

    const handleStatusUpdate = (newStatus: 'pending' | 'in_progress' | 'resolved') => {
        setIsUpdatingStatus(true);
        router.patch(`/complaints/${complaint.id}/status`, { status: newStatus }, {
            onFinish: () => setIsUpdatingStatus(false),
            preserveState: false,
            preserveScroll: true,
        });
    };

    const getBackUrl = () => {
        if (isOfficer) return officerComplaints();
        if (isAdmin) return adminComplaints();
        return userComplaints();
    };

    const getBreadcrumbs = () => [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: (isOfficer || isAdmin) ? 'Keluhan Yang Ditangani' : 'Keluhan Saya',
            href: getBackUrl()
        },
        { title: 'Detail Keluhan', href: `/complaints/${complaint.id}` },
    ];

    return (
        <AppShell variant="header">
            <AppHeader breadcrumbs={getBreadcrumbs()} />
            <AppContent>
                <div className="space-y-6 mt-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => router.visit(getBackUrl())}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="text-3xl font-bold tracking-tight">Detail Keluhan</h2>
                        </div>
                        <div className="flex items-center space-x-3">
                            <StatusBadge status={complaint.status} />
                            {canUpdateStatus && (
                                <StatusSelector
                                    currentStatus={complaint.status}
                                    onStatusChange={handleStatusUpdate}
                                    isUpdating={isUpdatingStatus}
                                />
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{complaint.title}</CardTitle>
                            <CardDescription>
                                Kategori: <span className="font-medium text-foreground">{complaint.category?.name}</span>
                                <span className="mx-2">•</span>
                                Diajukan pada: <span className="font-medium text-foreground">
                                    {format(new Date(complaint.created_at), 'dd MMM yyyy HH:mm')}
                                </span>
                                {complaint.updated_at !== complaint.created_at && (
                                    <>
                                        <span className="mx-2">•</span>
                                        Diperbarui pada: <span className="font-medium text-foreground">
                                            {format(new Date(complaint.updated_at), 'dd MMM yyyy HH:mm')}
                                        </span>
                                    </>
                                )}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Complaint Content */}
                            <div className="flex items-start space-x-4">
                                {!complaint.is_anonymous ? (
                                    <UserAvatar user={complaint.user as any} size="lg" className="border" />
                                ) : (
                                    <Avatar className="h-10 w-10 rounded-full border">
                                        <AvatarImage
                                            src="https://ui-avatars.com/api/?name=Anonymous&color=7F9CF5&background=EBF4FF"
                                            alt="Anonymous User"
                                        />
                                        <AvatarFallback>AN</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="flex-1">
                                    <div className="mb-1">
                                        <span className="font-medium">
                                            {complaint.is_anonymous ? 'Anonim' : complaint.user?.name}
                                        </span>
                                    </div>
                                    <div className="prose max-w-none text-sm dark:prose-invert">
                                        <p>{complaint.description}</p>
                                    </div>
                                    <MediaAttachments media={complaint.media} className="mt-3" />
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="relative mt-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-card px-2 text-sm text-muted-foreground">Komentar</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {!complaint.comments || complaint.comments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                                        <div className="rounded-full bg-muted p-3">
                                            <AlertCircle className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <h3 className="mt-2 font-medium">Belum Ada Komentar</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada komentar pada keluhan ini
                                        </p>
                                    </div>
                                ) : (
                                    complaint.comments.map((comment) => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            isAnonymousComplaint={complaint.is_anonymous}
                                            canAddComment={canAddComment}
                                            onQuote={setQuotedComment}
                                        />
                                    ))
                                )}
                            </div>
                        </CardContent>

                        {canAddComment && (
                            <CardFooter>
                                <CommentForm
                                    complaintId={complaint.id}
                                    quotedComment={quotedComment}
                                    onQuoteCancel={() => setQuotedComment(null)}
                                />
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </AppContent>
        </AppShell>
    );
}
