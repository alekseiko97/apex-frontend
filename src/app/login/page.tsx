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
        try {
            await login(username, password); // API call for login
            router.push('/categories'); // redirect to categories page after login
        } catch (error) {
            setError('Login failed');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                />
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}

export default LoginPage