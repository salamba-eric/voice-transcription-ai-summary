import axios from 'axios';

const token = localStorage.getItem("authToken");
const backend_url = '/api/departments'; // Adjust this URL as needed

export const create_department = async (name) => {
    try {
        console.log(token)
        const response = await axios.post("http://127.0.0.1:8000/api/departments/create/", { name }, {
            headers: {'Authorization': `Token ${token}`},
        });
        return response.data;
    } catch (error) {
        console.error("Error creating department:", error);
        throw error;
    }
}

export const get_departments = async () => {
    try {
        const response = await axios.get(`${backend_url}/list/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
}

export const join_department = async (department_id, staff_id) => {
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/departments/${department_id}/join/2/`, { department_id },
            { headers: {'Authorization': `Token ${token}`}, }
        );
        return response.data;
    } catch (error) {
        console.error("Error joining department:", error);
        throw error;
    }
}