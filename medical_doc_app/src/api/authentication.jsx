import axios from 'axios'


export const login = async (username, password) => {
    try {
            const response = await axios.post('/api/login/', { username, password }, );
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
}