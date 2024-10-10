"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchCategoryDetails } from "@/services/api";

interface Product {
    id: number;
    name: string;
    description: string;
    sku: string;
    ean: string;
    url: string;
}

interface Category {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    products: Product[];
}

const CategoryDetailPage = () => {
    const { id } = useParams(); // This grabs the 'id' from the dynamic URL
    const router = useRouter();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const loadCategoryDetails = async () => {
                try {
                    const data = await fetchCategoryDetails(id as string);
                    setCategory(data);
                    setLoading(false);
                } catch (error) {
                    setError("Error fetching category details");
                    setLoading(false);
                }
            };

            loadCategoryDetails();
        }
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    console.log("sku: " + category?.products[0].sku);
    console.log("ean: " + category?.products[0].ean);
    console.log("url: " + category?.products[0].url);
    console.log("name: " + category?.products[0].name);

    return (
        <div className="container mx-auto p-8">
            {category && (
                <>
                    <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
                    <p>{category.description}</p>
                    <p>Status: {category.is_active ? "Active" : "Inactive"}</p>
                    <p>Created At: {new Date(category.created_at).toLocaleDateString()}</p>

                    {/* Products Table */}
                    <h2 className="text-2xl font-bold mt-8 mb-4">Products</h2>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="p-3 text-left">Product Name</th>
                                <th className="p-3 text-left">SKU</th>
                                <th className="p-3 text-left">EAN</th>
                                <th className="p-3 text-left">URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {category.products.map((product) => (
                                <tr key={product.id} className="border-t">
                                    <td className="p-3">{product.name}</td>
                                    <td className="p-3">{product.description}</td>
                                    <td className="p-3">{product.sku}</td>
                                    <td className="p-3">{product.ean}</td>
                                    <td className="p-3">
                                        <a href={product.url} target="_blank" rel="noopener noreferrer">
                                            View Product
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default CategoryDetailPage;