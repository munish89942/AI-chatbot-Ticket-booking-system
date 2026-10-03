const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const candidates = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-2.0-flash-lite",
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-exp-1206",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest"
];

async function findWorkingModel() {
    console.log("Testing models to find one that works...");

    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you working?");
            const response = await result.response;
            const text = response.text();

            if (text) {
                console.log("SUCCESS! ✅");
                console.log(`Working Model Found: ${modelName}`);
                return; // Exit after finding first working one
            }
        } catch (error) {
            console.log("FAILED ❌");
            // console.log(`Error: ${error.message}`); 
            // Keep output clean, just show failed
        }
    }

    console.log("All models failed. Please check API Key quota/permissions.");
}

findWorkingModel();
