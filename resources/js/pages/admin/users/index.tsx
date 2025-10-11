import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Search, Filter, Trash, Edit, Eye } from 'lucide-react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'officer' | 'user';
    created_at: string;
}

interface UserIndexProps {
    users: {
        data: User[];
        links: any;
        total: number;
    };
    filters: {
        role?: string;
        search?: string;
    }
}

export default function UserIndex({ users, filters }: UserIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/users', { search, role }, { preserveState: true });
    }

    function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newRole = e.target.value;
        setRole(newRole);
        router.get('/admin/users', { search, role: newRole }, { preserveState: true });
    }

    function handleDelete(userId: number) {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(`/admin/users/${userId}`);
        }
    }

    return (
        <AppLayout>
            <Head title="Manajemen Pengguna" />

            <div className="p-4">
                <div className="flex justify-between items-center ">
                    <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
                    <Link href="/admin/users/create">
                        <Button className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Tambah Pengguna
                        </Button>
                    </Link>
                </div>

                <div className="py-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari pengguna..."
                                        className="pl-10 pr-4 py-2 w-full border rounded-md"
                                    />
                                </div>
                                <Button type="submit">Cari</Button>
                            </form>
                        </div>
                        <div className="flex items-center gap-2 min-w-[200px]">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <select
                                value={role}
                                onChange={handleRoleChange}
                                className="border rounded-md p-2 w-full"
                            >
                                <option value="">Semua Peran</option>
                                <option value="admin">Admin</option>
                                <option value="officer">Petugas</option>
                                <option value="user">Pengguna</option>
                            </select>
                        </div>
                    </div>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left">Nama</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Peran</th>
                                    <th className="px-4 py-3 text-left">Dibuat Pada</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3 whitespace-nowrap">{user.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                    user.role === 'officer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/users/${user.id}/edit`} className="p-1 rounded hover:bg-gray-100">
                                                    <Edit className="h-4 w-4 text-blue-500" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-1 rounded hover:bg-gray-100"
                                                >
                                                    <Trash className="h-4 w-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {users.data.length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                            Tidak ada pengguna ditemukan.
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="px-4 py-3 flex items-center justify-between border-t">
                        <div className="text-sm text-gray-500">
                            Menampilkan <span className="font-medium">{users.data.length}</span> dari <span className="font-medium">{users.total}</span> pengguna
                        </div>
                        {users.links && users.links.length > 3 && (
                            <div className="flex gap-1">
                                {users.links.map((link: any, i: number) => {
                                    // Skip first and last items if they are "prev/next" links and not needed
                                    if ((i === 0 && link.label.includes('Previous') && link.url === null) ||
                                        (i === users.links.length - 1 && link.label.includes('Next') && link.url === null)) {
                                        return null;
                                    }

                                    return (
                                        <Link
                                            key={i}
                                            href={link.url || ''}
                                            className={`px-3 py-1 rounded text-sm ${link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url === null
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
