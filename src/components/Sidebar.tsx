"use client";

import { useRouter } from "next/navigation";

const Sidebar = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('sessionToken');
        router.push('/login');
    };

    return (
        <aside className="bg-gray-700 text-white h-screen w-64 p-4">
            <nav className="flex flex-col space-y-4">
                <button
                    className="p-2 bg-blue-500 text-white rounded"
                    onClick={() => router.push('/categories')}
                >
                    View Categories
                </button>
                <button
                    className="p-2 bg-green-500 text-white rounded"
                    onClick={() => router.push('/categories/create')}
                >
                    Create Category
                </button>
                <button
                    className="p-2 bg-red-500 text-white rounded"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;