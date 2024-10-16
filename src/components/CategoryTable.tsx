'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCategories, deleteCategory } from '@/services/api';
import Link from 'next/link';

interface Category {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    products_count: number;
    parent_category?: Category | null;
    subcategories?: Category[]
}

const CategoryTable = () => {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>(''); // For status filter
    const [sortConfig, setSortConfig] = useState<{ key: keyof Category; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]); // Track expanded categories
    const [showDialog, setShowDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    const pageSize = 10;

    const refreshCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching categories');
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshCategories();
    }, []);

    const openDialog = (categoryId: number) => {
        setCategoryToDelete(categoryId);
        setShowDialog(true);
    };

    const closeDialog = () => {
        setCategoryToDelete(null);
        setShowDialog(false);
    };

    const handleSort = (key: keyof Category) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedCategories = () => {
        if (sortConfig !== null) {
            return [...categories].sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                // Ensure that both values exist before comparing
                if (aValue == null || bValue == null) {
                    return 0; // Treat undefined or null values as equal
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return categories;
    };

    const handleDelete = async (categoryId: number) => {
        try {
            const responseStatus = await deleteCategory(categoryId);
            if (responseStatus === 204) {
                alert("Category deleted successfully!");
                closeDialog();
                refreshCategories(); // Refresh categories after successful deletion
            }
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete category.");
        }
    };

    const filteredCategories = () => {
        return sortedCategories().filter((category) => {
            const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === '' || (filterStatus === 'active' && category.is_active) || (filterStatus === 'inactive' && !category.is_active);
            return matchesSearch && matchesStatus;
        });
    };

    const paginatedCategories = () => {
        const start = (currentPage - 1) * pageSize;
        return filteredCategories().slice(start, start + pageSize);
    };

    const totalPages = Math.ceil(filteredCategories().length / pageSize);

    const toggleCategory = (uniqueCategoryKey: string) => {
        setExpandedCategories((prevExpanded) =>
            prevExpanded.includes(uniqueCategoryKey)
                ? prevExpanded.filter((key) => key !== uniqueCategoryKey)
                : [...prevExpanded, uniqueCategoryKey]
        );
    };

    // Helper to generate a unique key for the category based on its position in the tree
    const getUniqueCategoryKey = (categoryId: number, parentCategoryId: number | null): string => {
        return `${parentCategoryId || 'root'}-${categoryId}`;
    };

    const renderCategoryRow = (category: Category, level: number = 0, parentCategoryId: number | null = null): JSX.Element[] | JSX.Element | null => {
        const uniqueCategoryKey = getUniqueCategoryKey(category.id, parentCategoryId);

        const isExpanded = expandedCategories.includes(uniqueCategoryKey);

        // Only show the button if the category has subcategories
        const hasSubcategories = category.subcategories && category.subcategories.length > 0;

        return (
            <>
                <tr key={uniqueCategoryKey} className={`border-t ${level > 0 ? 'bg-gray-100' : ''}`}>
                    <td className="p-3">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginLeft: `${level * 20 + (hasSubcategories ? 0 : 30)}px`, // Add more margin if there's no button
                            }}
                        >
                            {hasSubcategories && (
                                <button
                                    onClick={() => toggleCategory(uniqueCategoryKey)}
                                    className="mr-2 inline-flex items-center justify-center w-6 h-6 text-white bg-blue-500 rounded-full focus:outline-none"
                                >
                                    {isExpanded ? '-' : '+'}
                                </button>
                            )}
                            <Link href={`/categories/${category.id}`}>
                                {category.name}
                            </Link>
                        </div>
                    </td>
                    <td className="p-3">{category.is_active ? 'Active' : 'Inactive'}</td>
                    <td className="p-3">{category.products_count ?? 0}</td>
                    <td className="p-3">{new Date(category.created_at).toLocaleDateString()}</td>
                    <td>
                        <button
                            className="mr-2 p-2 bg-blue-500 text-white rounded"
                            onClick={() => router.push(`/categories/edit/${category.id}`)}>
                            Edit
                        </button>
                        <button
                            className="p-2 bg-red-500 text-white rounded"
                            onClick={() => openDialog(category.id)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>

                {/* Modal dialog - confirm category delete */}
                {showDialog && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                            <p>Are you sure you want to delete this category?</p>
                            <div className="flex justify-end mt-6">
                                <button
                                    className="mr-2 p-2 bg-gray-300 rounded"
                                    onClick={closeDialog}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="p-2 bg-red-500 text-white rounded"
                                    onClick={() => handleDelete(category.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* If the category is expanded, render its subcategories recursively */}
                {isExpanded && category.subcategories && category.subcategories.map((subcategory) => (
                    renderCategoryRow(subcategory, level + 1, category.id)
                ))}
            </>
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Categories Overview</h1>

            {/* Search Input */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description"
                className="mb-4 p-2 border rounded w-full"
            />

            {/* Filter by Status */}
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>

            {/* Categories Table */}
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                        <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('is_active')}>Status</th>
                        <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('products_count')}>Product count</th>
                        <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('created_at')}>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCategories().map((category) => renderCategoryRow(category))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="p-2 border rounded"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    className="p-2 border rounded"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CategoryTable;
