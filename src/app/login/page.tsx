'use client'; // This marks the component as a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from '@/services/api'

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); // Loading state

    // Check if the user is logged in by checking if the sessionToken exists
    useEffect(() => {
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
            // Redirect to the category overview page if the user is logged in already
            router.push('/categories')
        } else {
            setIsLoading(false); // Only stop loading if user is not logged in
        }
    }, [router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Both fields are required!");
        } else {
            try {
                await login(username, password); // API call for login
                router.push('/categories'); // redirect to categories page after login
            } catch (error) {
                setError('Login failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 m-0 p-0">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-gray-700">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-300 ease-in-out"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage