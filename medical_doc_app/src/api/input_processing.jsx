import axios from "axios";

const token = localStorage.getItem('authToken')
const image_url = 'http://127.0.0.1:8000/api/image-processing'
const audio_url = 'http://127.0.0.1:8000/api/audio-processing'
const text_url = 'http://127.0.0.1:8000/api/text-processing'

export const upload_image = async(formData) => {
    try{
            await axios.post(`${image_url}/upload-image/`, formData, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
    try{
        console.log("processing image")
        const response2 = await axios.post(`${image_url}/process-image/`, formData, {
            headers: {
                'Authorization': `Token ${token}`
            }})

        console.log(response2)
        return response2
        } catch(error){
            console.error("Image processing failed", error.response.request.responseText)
            throw error
        }
    } catch (error){
        console.error("Image upload failed", error.response.request.responseText)
        throw error
    }
}

export const upload_audio = async(formData) => {
    try{
        const response = await axios.post(`${audio_url}/transcribe/`, formData, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        return response
    } catch (error){
        console.error("Audio chunk upload failed", error.response.request.responseText)
        throw error
    }
}

export const classify_text = async (transcript) => {
    try {
        const response = await axios.post(`${text_url}/classify/`, transcript, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        console.log("Classified text:", response.data.predicted_class);

        const classes = {};

        const entityPromises = response.data.predicted_class.map(async (item) => {
            console.log(`Class: ${item.class} : text: ${item.text}`);

            if (item.class !== "SmallTalk") {
                try {
                    const response2 = await axios.post(`${text_url}/extract-entities/`, { "text": item.text }, {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });

                    console.log(`Extracted entities for class ${item.class}:`, response2.data);
                    // Initialize class bucket if not already
                    if (!classes[item.class]) {
                        classes[item.class] = {};
                    }
                    Object.assign(classes[item.class], response2.data);
                } catch (error) {
                    console.error("Entity extraction failed", error.response?.request?.responseText || error.message);
                    throw error;
                }
            } else {
                console.log(`Small Talk detected, no entities to extract: ${item.class}: ${item.text}`);
            }
        });

        await Promise.all(entityPromises);

        return classes;

    } catch (error) {
        console.error("Text classification failed", error.response?.request?.responseText || error.message);
        throw error;
    }
};

