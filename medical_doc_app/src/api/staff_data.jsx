import axios from 'axios';

export const get_staff_data = async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/employees/me/`, {
            headers: {'Authorization': `Token ${localStorage.getItem("authToken")}`},
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching staff data:", error);
        throw error;
    }
}
