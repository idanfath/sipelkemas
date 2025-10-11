import { UserAvatar } from '@/components/user-avatar';
import { type User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    return (
        <>
            <UserAvatar user={user} size="md" />
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs text-muted-foreground">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className="truncate font-medium">{user.name}</span>
                {/* role */}
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
