"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchCategoryDetails, updateCategory } from "@/services/api";

const EditCategoryPage = () => {
    const [category, setCategory] = useState({
        name: "",
        description: "",
        is_active: true,
        products: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        const sessionToken = localStorage.getItem("sessionToken");

        if (!sessionToken) {
            router.push("/login");
        } else {
            const loadCategory = async () => {
                try {
                    const data = await fetchCategoryDetails(id as string);
                    setCategory({
                        name: data.name,
                        description: data.description,
                        is_active: data.is_active,
                        products: data.products,
                    });
                    setLoading(false);
                } catch (error) {
                    setError("Error fetching category");
                    setLoading(false);
                }
            };
            
            loadCategory();
        }
    }, [id]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await updateCategory(id as string, category);
            router.push(`/categories/${id}`);
        } catch (error) {
            console.log(error);
            setError("Error updating category");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategory((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Edit Category</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={category.description}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Status</label>
                    <select
                        name="is_active"
                        value={category.is_active ? "active" : "inactive"}
                        onChange={(e) =>
                            setCategory((prev) => ({
                                ...prev,
                                is_active: e.target.value === "active",
                            }))
                        }
                        className="border p-2 w-full"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                    Save
                </button>
            </form>
        </div>
    );
};

export default EditCategoryPage;