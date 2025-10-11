import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'officer' | 'user';
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    user_id: number;
    officer?: User;
    created_at: string;
    updated_at: string;
    complaints?: Complaint[];
}

export interface Comment {
    id: number;
    complaint_id: number;
    user_id: number;
    quoted_comment_id?: number;
    comment: string;
    media?: string[];
    created_at: string;
    updated_at: string;
    user?: User;
    complaint?: Complaint;
    quotedComment?: Comment;
}

export interface Complaint {
    id: number;
    user_id: number;
    category_id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved';
    media?: string[];
    is_anonymous: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
    category?: Category;
    comments?: Comment[];
}
