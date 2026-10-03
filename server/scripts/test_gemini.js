const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // The SDK doesn't have a direct "listModels" on the client instance in some versions, 
        // but usually it's just a fetch.
        // Actually, looking at docs, it's typically just knowing the model.
        // But let's try a simple generation with 'gemini-pro' to see if that works as fallback test.

        // Better: use the REST API to list models if SDK doesn't expose it easily in this version.
        console.log("Testing gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await modelPro.generateContent("Hello");
        console.log("gemini-pro works: ", result.response.text());
    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }

    try {
        console.log("Testing gemini-1.5-flash-latest...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await modelFlash.generateContent("Hello");
        console.log("gemini-1.5-flash-latest works: ", result.response.text());
    } catch (error) {
        console.error("gemini-1.5-flash-latest failed:", error.message);
    }
}

listModels();
