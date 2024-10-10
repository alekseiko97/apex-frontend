// src/services/api.ts
export async function login(username: string, password: string) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/session/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // Log the raw response
        console.log('API Response:', response);

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Error message from server:', errorMessage);
            throw new Error(`Login failed: ${errorMessage}`);
        }

        const data = await response.json();
        console.log('Response Data:', data);

        localStorage.setItem('sessionToken', data.sessionToken);

        console.log(data.sessionToken);

        return data;  // Return the data in case we need it in the app
    } catch (error) {
        console.error('Login error:', error);
        throw error;  // Re-throw the error to handle it in the calling component
    }
}

export const fetchCategoryDetails = async (id: string) => {
    const sessionToken = localStorage.getItem('sessionToken');

    if (!sessionToken) {
        throw new Error('Session token is missing. Please login.');
    }

    const response = await fetch(`http://127.0.0.1:8000/api/categories/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Handle unauthorized, possibly redirect to login
            throw new Error('Unauthorized. Please login again.');
        }
        throw new Error(`Error fetching categories.\nHTTP status: ${response.status}`);
    }

    return await response.json();
};

export const updateCategory = async (id: string, updatedData: any) => {
    const response = await fetch(`http://127.0.0.1:8000/api/categories/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`,
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        throw new Error(`Error updating category. HTTP status: ${response.status}`);
    }

    return await response.json();
};

export const fetchCategories = async () => {
    const sessionToken = localStorage.getItem('sessionToken');

    if (!sessionToken) {
        throw new Error('Session token is missing. Please login.');
    }

    const response = await fetch('http://127.0.0.1:8000/api/categories', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Handle unauthorized, possibly redirect to login
            throw new Error('Unauthorized. Please login again.');
        }
        throw new Error(`Error fetching categories.\nHTTP status: ${response.status}`);
    }

    return await response.json();
};
