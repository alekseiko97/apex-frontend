"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { createCategory } from "@/services/api"; 

const CreateCategoryPage = () => {
    const router = useRouter();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(true);
    const [parentCategory, setParentCategory] = useState<number | null>(null); // If there are parent 
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in
        const token = localStorage.getItem('sessionToken');
        if (!token) {
            router.push('/login'); // Redirect to login if not logged in
        } else {
            setIsLoggedIn(true);
        }
    }, [router]);

    if (!isLoggedIn) {
        return null; // Don't show anything until logged in check is done
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCategory({
                name,
                description,
                is_active: isActive,
                parent_category: parentCategory
            });
            router.push("/categories"); // Redirect to the categories overview page
        } catch (error) {
            console.error("Error creating category:", error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Create a New Category</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Category Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="p-2 border rounded w-full"
                        placeholder="Enter category name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-2 border rounded w-full"
                        placeholder="Enter description"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Status</label>
                    <select
                        value={isActive ? "active" : "inactive"}
                        onChange={(e) => setIsActive(e.target.value === "active")}
                        className="p-2 border rounded w-full"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Parent Category</label>
                    <input
                        type="number"
                        value={parentCategory || ""}
                        onChange={(e) => setParentCategory(Number(e.target.value))}
                        className="p-2 border rounded w-full"
                        placeholder="Enter parent category ID (optional)"
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Create Category
                </button>
            </form>
        </div>
    );
};

export default CreateCategoryPage;
