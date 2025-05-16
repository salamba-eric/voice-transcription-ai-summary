import axios from 'axios';
import { development } from './axios';


const backend_url = "http://localhost:8000/";


export const get_staff_data = async () => {
    if (development) {
        try {
            const response = await axios.get(`${backend_url}api/staff/`);
            return response.data;
        } catch (error) {
            console.error("Error fetching staff data:", error);
            throw error;
        }
    } else {
        return {
            name: 'Dr. Jane Doe',
            id: 1,
            position: 'Cardiologist',
            department: 'Cardiology',
            image: 'https://via.placeholder.com/150'
        };
    }
}
