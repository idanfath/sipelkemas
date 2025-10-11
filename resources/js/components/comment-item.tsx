import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MediaAttachments } from '@/components/media-attachments';
import { User, Comment } from '@/types';

interface CommentItemProps {
    comment: Comment;
    isAnonymousComplaint: boolean;
    canAddComment: boolean;
    onQuote: (comment: Comment) => void;
}

export function CommentItem({
    comment,
    isAnonymousComplaint,
    canAddComment,
    onQuote
}: CommentItemProps) {
    if (!comment.user) return null;

    const shouldShowAnonymous = comment.user.role === "user" && isAnonymousComplaint;
    const displayName = shouldShowAnonymous ? 'Anonim' : comment.user.name;

    return (
        <div className="flex items-start space-x-4">
            {shouldShowAnonymous ? (
                <Avatar className="h-10 w-10 rounded-full border">
                    <AvatarImage
                        src="https://ui-avatars.com/api/?name=Anonymous&color=7F9CF5&background=EBF4FF"
                        alt="Anonymous User"
                    />
                    <AvatarFallback>AN</AvatarFallback>
                </Avatar>
            ) : (
                <UserAvatar user={comment.user as any} size="lg" className="border" />
            )}

            <div className="flex-1">
                <div className="rounded-lg bg-muted p-4">
                    <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">{displayName}</span>
                            {comment.user.role !== 'user' && (
                                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                                    {comment.user.role.charAt(0).toUpperCase() + comment.user.role.slice(1)}
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.created_at), 'dd MMM yyyy HH:mm')}
                        </span>
                    </div>

                    {comment.quotedComment && (
                        <div className="mb-2 rounded border-l-2 border-primary bg-muted/50 p-2 text-sm">
                            <div className="mb-1 text-xs font-medium">
                                {comment.quotedComment.user?.name || 'Unknown User'} menulis:
                            </div>
                            <p className="text-muted-foreground">
                                {comment.quotedComment.comment.length > 100
                                    ? `${comment.quotedComment.comment.substring(0, 100)}...`
                                    : comment.quotedComment.comment}
                            </p>
                        </div>
                    )}

                    <p>{comment.comment}</p>

                    <MediaAttachments media={comment.media} className="mt-2" size="sm" />
                </div>

                {canAddComment && (
                    <div className="mt-1 flex items-center justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onQuote(comment)}
                            className="h-auto px-2 py-1 text-xs"
                        >
                            Balas
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
