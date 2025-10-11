import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Officer {
    id: number;
    name: string;
    email: string;
}

interface Category {
    id: number;
    name: string;
    description: string;
    user_id: number;
    officer: Officer | null;
    created_at: string;
    updated_at: string;
}

interface CategoriesIndexProps {
    categories: {
        data: Category[];
        links: any;
        total: number;
    };
    officers: Officer[];
}

export default function CategoryIndex({ categories, officers }: CategoriesIndexProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

    const [values, setValues] = useState({
        name: '',
        description: '',
        user_id: officers.length > 0 ? officers[0].id : '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        router.post('/admin/categories', values, {
            onSuccess: () => {
                setIsModalOpen(false);
                setValues({
                    name: '',
                    description: '',
                    user_id: officers.length > 0 ? officers[0].id : '',
                });
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            }
        });
    }

    function handleUpdate(e: React.FormEvent) {
        e.preventDefault();

        if (!currentCategory) return;

        router.patch(`/admin/categories/${currentCategory.id}`, values, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setCurrentCategory(null);
                setValues({
                    name: '',
                    description: '',
                    user_id: officers.length > 0 ? officers[0].id : '',
                });
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            }
        });
    }

    function openEditModal(category: Category) {
        setCurrentCategory(category);
        setValues({
            name: category.name,
            description: category.description || '',
            user_id: category.user_id.toString(),
        });
        setIsEditModalOpen(true);
    }

    function handleDelete(categoryId: number) {
        if (confirm('Are you sure you want to delete this category? This will fail if there are any complaints in this category.')) {
            router.delete(`/admin/categories/${categoryId}`);
        }
    }

    return (
        <AppLayout>
            <Head title="Category Management" />

            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Manajemen Kategori</h1>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left">Name</th>
                                    <th className="px-4 py-3 text-left">Description</th>
                                    <th className="px-4 py-3 text-left">Assigned Officer</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {categories.data.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3 font-medium">{category.name}</td>
                                        <td className="px-4 py-3">
                                            {category.description || <span className="text-gray-400 italic">No description</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            {category.officer ? category.officer.name : <span className="text-gray-400 italic">No officer assigned</span>}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="p-1 rounded hover:bg-gray-100"
                                                >
                                                    <Edit className="h-4 w-4 text-blue-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
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
                    {categories.data.length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                            No categories found.
                        </div>
                    )}

                    {/* Pagination */}
                    {categories.links && categories.links.length > 3 && (
                        <div className="px-4 py-3 flex items-center justify-between border-t">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">{categories.data.length}</span> of <span className="font-medium">{categories.total}</span> categories
                            </div>
                            <div className="flex gap-1">
                                {categories.links.map((link: any, i: number) => {
                                    // Skip first and last items if they are "prev/next" links and not needed
                                    if ((i === 0 && link.label.includes('Previous') && link.url === null) ||
                                        (i === categories.links.length - 1 && link.label.includes('Next') && link.url === null)) {
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
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
                        </div>
                    )}
                </Card>

                {/* Add Category Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">Add New Category</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1" htmlFor="name">
                                            Name
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
                                        <label className="block text-sm font-medium mb-1" htmlFor="description">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={values.description}
                                            onChange={handleChange}
                                            rows={3}
                                            className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-1" htmlFor="user_id">
                                            Assign Officer
                                        </label>
                                        <select
                                            id="user_id"
                                            name="user_id"
                                            value={values.user_id}
                                            onChange={handleChange}
                                            className={`w-full p-2 border rounded-md ${errors.user_id ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            {officers.length === 0 ? (
                                                <option value="">No officers available</option>
                                            ) : (
                                                officers.map((officer) => (
                                                    <option key={officer.id} value={officer.id}>
                                                        {officer.name} ({officer.email})
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                        {errors.user_id && (
                                            <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                setErrors({});
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            Add Category
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Category Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">Edit Category</h2>
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1" htmlFor="name">
                                            Name
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
                                        <label className="block text-sm font-medium mb-1" htmlFor="description">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={values.description}
                                            onChange={handleChange}
                                            rows={3}
                                            className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-1" htmlFor="user_id">
                                            Assign Officer
                                        </label>
                                        <select
                                            id="user_id"
                                            name="user_id"
                                            value={values.user_id}
                                            onChange={handleChange}
                                            className={`w-full p-2 border rounded-md ${errors.user_id ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            {officers.map((officer) => (
                                                <option key={officer.id} value={officer.id}>
                                                    {officer.name} ({officer.email})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.user_id && (
                                            <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsEditModalOpen(false);
                                                setCurrentCategory(null);
                                                setErrors({});
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            Update Category
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
