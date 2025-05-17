import axios from 'axios';


const backend_url = "http://localhost:8000/";


export const get_staff_data = async () => {
    try {
        const response = await axios.get(`${backend_url}api/staff/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching staff data:", error);
        throw error;
    }
}
