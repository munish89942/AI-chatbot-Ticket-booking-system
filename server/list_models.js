const axios = require('axios');
require('dotenv').config();

async function listModels() {
    try {
        const response = await axios.get('https://api.x.ai/v1/models', {
            headers: {
                'Authorization': `Bearer ${process.env.GROK_API_KEY}`
            }
        });
        console.log("Available Models:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error listing models:", error.response ? error.response.data : error.message);
    }
}

listModels();
