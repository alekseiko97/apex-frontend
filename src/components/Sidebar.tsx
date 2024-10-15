"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Sidebar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Function to check if token exists
    const checkLoginStatus = () => {
        const token = localStorage.getItem('sessionToken');
        setIsLoggedIn(!!token); // Set to true if token exists
    };

    useEffect(() => {
        checkLoginStatus(); // Check login status when component mounts
        window.addEventListener('storage', checkLoginStatus); // Listen for storage changes (in case of manual updates)

        return () => {
            window.removeEventListener('storage', checkLoginStatus); // Clean up listener
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('sessionToken');
        setIsLoggedIn(false);
        router.push('/login');
    };

    const handleLoginRedirect = () => {
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
                    onClick={isLoggedIn ? handleLogout : handleLoginRedirect}
                >
                    {isLoggedIn ? 'Logout' : 'Login'}
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;