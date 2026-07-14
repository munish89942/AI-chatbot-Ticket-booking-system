const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API Key found");
        return;
    }

    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const models = response.data.models;
        console.log("--- START MODEL LIST ---");
        models.forEach(m => {
            // Log name and supported generation methods
            console.log(`Model: ${m.name}`);
        });
        console.log("--- END MODEL LIST ---");
    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
