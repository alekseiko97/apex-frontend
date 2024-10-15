"use client";

import { useEffect, useState } from "react";
import { fetchUser } from "@/services/api";

interface Organization {
    id: number;
    name: string;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    organization: Organization;
}

const Header = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error("Error loading user data: ", error);
            }
        };

        loadUser();
    }, []);

    if (!user) return null;

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <span className="bg-white">{user.email}</span>
            </div>
        </header>
    );
};

export default Header;