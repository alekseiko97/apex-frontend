"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    products: { length: number };
}

const CategoryOverview = () => {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/categories', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setCategories(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
            // Redirect to login if no session token
            router.push('/login');
        } else {
            fetchCategories();
        }
    }, [router]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    const filteredCategories = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div>
            <h1>Category Overview</h1>
            <input
                type="text"
                placeholder="Search categories"
                value={searchQuery}
                onChange={handleSearch}
            />
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Amount of Products</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>{category.is_active ? 'Active' : 'Inactive'}</td>
                            <td>{new Date(category.created_at).toLocaleDateString()}</td>
                            <td>{category.products.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryOverview;

