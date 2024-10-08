'use client';

import { useEffect, useState } from 'react';
import { fetchCategories } from '@/services/api';

interface Category {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    products_count: number;
}

const CategoryTable = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>(''); // For status filter
    const [sortConfig, setSortConfig] = useState<{ key: keyof Category; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10;

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching categories');
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

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
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return categories;
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
                        <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('products_count')}>Products</th>
                        <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('created_at')}>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCategories().map((category) => (
                        <tr key={category.id} className="border-t">
                            <td className="p-3">{category.name}</td>
                            <td className="p-3">{category.is_active ? 'Active' : 'Inactive'}</td>
                            <td className="p-3">{category.products_count}</td>
                            <td className="p-3">{new Date(category.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
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
