import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    user: User | Partial<User>;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showFallback?: boolean;
}

const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-24 w-24'
};

const fallbackSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
};

export function UserAvatar({
    user,
    size = 'md',
    className,
    showFallback = true
}: UserAvatarProps) {
    const getInitials = useInitials();

    // Use profile picture if available, otherwise fall back to default avatar URL
    const avatarSrc = (user as User).profile_picture_or_default || user.avatar;
    const userName = user.name || 'Unknown User';

    return (
        <Avatar className={cn(sizeClasses[size], 'overflow-hidden rounded-full', className)}>
            <AvatarImage
                src={avatarSrc}
                alt={userName}
            />
            {showFallback && (
                <AvatarFallback className={cn(
                    'rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white',
                    fallbackSizeClasses[size]
                )}>
                    {getInitials(userName)}
                </AvatarFallback>
            )}
        </Avatar>
    );
}
