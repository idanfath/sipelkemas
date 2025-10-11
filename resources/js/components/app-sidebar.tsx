
// CONDITIONAL SIDEBAR

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { adminCategories, adminComplaints, adminUsers, createComplaint, dashboard, officerCategories, officerComplaints, userComplaints } from '@/routes';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, User } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const RoleNavItems: {
    [key: string]: NavItem[]
} = {
    admin: [
        {
            title: 'Manajemen Pengguna',
            href: adminUsers(),
            icon: User,
        },
        {
            title: 'Manajemen Kategori',
            href: adminCategories(),
            icon: Folder,
        },
        {
            title: 'Manajemen Laporan',
            href: adminComplaints(),
            icon: BookOpen,
        }
    ],
    officer: [
        {
            title: 'Daftar Pengaduan',
            href: officerComplaints(),
            icon: BookOpen,
        },
        {
            title: 'Kategori',
            href: officerCategories(),
            icon: Folder,
        },
    ],
    user: [
        {
            title: 'Daftar Pengaduan',
            href: userComplaints(),
            icon: Folder,
        },
    ],
};

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={[...mainNavItems, ...RoleNavItems[auth.user.role]]} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
