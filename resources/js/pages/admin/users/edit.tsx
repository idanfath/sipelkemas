import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface EditUserProps {
    user: User;
}

export default function EditUser({ user }: EditUserProps) {
    const [values, setValues] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        router.patch(`/admin/users/${user.id}`, values, {
            onError: (errors) => {
                setErrors(errors);
            },
        });
    }

    return (
        <AppLayout>
            <Head title="Edit User" />

            <div className="p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Edit Pengguna</h1>
                </div>

                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="name">
                                Nama
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={values.name}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={values.email}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="role">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={values.role}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="user">User</option>
                                <option value="officer">Officer</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && (
                                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="password">
                                Password Baru (Opsional)
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={values.password}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Biarkan kosong jika tidak ingin mengubah password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-1" htmlFor="password_confirmation">
                                Konfirmasi Password Baru
                            </label>
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={values.password_confirmation}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Konfirmasi password baru"
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Link href="/admin/users">
                                <Button variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Update User
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
