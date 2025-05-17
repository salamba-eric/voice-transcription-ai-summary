import axios from 'axios';

const backend_url = "/api/patients";
export const create_patient = async (patientData) => {
    try {
        console.log(patientData)
        const response = await axios.post(`${backend_url}/create/`, patientData);
        return response.data;
    } catch (error) {
        console.error("Error creating patient:", error);
        throw error;
    }
}

export const get_patients = async () => {
    try {
        console.log("Fetching patients from backend...");
        const response = await axios.get(`${backend_url}/list`);
        return response.data;
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;
    }
}