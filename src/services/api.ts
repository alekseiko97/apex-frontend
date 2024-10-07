// src/services/api.ts
export async function login(username: string, password: string) {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/session/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) 
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Login failed: ${errorMessage}`);
      }
  
      const data = await response.json();
  
      localStorage.setItem('sessionToken', data.sessionToken);
  
      return data;  // Return the data in case we need it in the app
    } catch (error) {
      console.error('Login error:', error);
      throw error;  // Re-throw the error to handle it in the calling component
    }
  }
  