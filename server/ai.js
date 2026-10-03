const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require('./database');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const FALLBACK_MODELS = [DEFAULT_MODEL, "gemini-1.5-flash", "gemini-2.0-flash", "gemini-pro"];

async function getSystemContext() {
    return new Promise((resolve, reject) => {
        // Fetch Settings
        db.all("SELECT * FROM settings", [], (err, settingsRows) => {
            if (err) return reject(err);
            const settings = {};
            settingsRows.forEach(r => settings[r.key] = r.value);

            // Fetch Tickets
            db.all("SELECT * FROM ticket_types", [], (err, ticketRows) => {
                if (err) return reject(err);

                // Fetch Slots
                db.all("SELECT * FROM time_slots WHERE is_active=1", [], (err, slotRows) => {
                    if (err) return reject(err);

                    resolve({ settings, tickets: ticketRows, slots: slotRows });
                });
            });
        });
    });
}

async function processChat(message, history) {
    try {
        const context = await getSystemContext();
        const currentDate = new Date().toISOString().split('T')[0];

        const systemPrompt = `
You are the helpful AI assistant for ${context.settings.museum_name}.
Location: ${context.settings.address}.
Hours: ${context.settings.opening_hours}.
Today's Date: ${currentDate}.

**Available Ticket Types:**
${context.tickets.map(t => `- ${t.name}: $${t.price} (${t.description})`).join('\n')}

**Time Slots:**
${context.slots.map(s => `- ${s.label}`).join('\n')}

**Goal:**
Help visitors book tickets. You must collect:
1. Date of visit (YYYY-MM-DD format preferred).
2. Time Slot (must match one of the available slots).
3. Ticket Types & Quantities (e.g., 2 Adults, 1 Child).

**Rules:**
- Be polite and concise.
- Provide accurate prices.
- If info is missing, ask for it.
- Do NOT invent ticket types or slots.
- When all information is collected and confirmed by the user, output a special JSON block at the END of your message:
  
  :::JSON
  {
      "booking_ready": true,
      "summary": "2 Adults, 1 Child for 2023-10-25 Morning",
      "details": {
          "date": "YYYY-MM-DD",
          "slot_label": "Morning (09:00 - 12:00)",
          "tickets": { "Adult": 2, "Child": 1 }
      }
  }
  :::

- If the user just has questions, answer them without the JSON block.
`;

        // Gemini Chat History Format
        // history is {role, content}. Gemini expects parts: [{text: ...}] and role: "user" | "model"
        const geminiHistory = [
            {
                role: "user",
                parts: [{ text: systemPrompt }]
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am ready to help visitors book tickets for the museum." }]
            }
        ];

        history.forEach(h => {
            geminiHistory.push({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }]
            });
        });

        // Current message is sent via chat.sendMessage, not added to history initialization usually?
        if (!process.env.GEMINI_API_KEY) {
            console.warn("No GEMINI_API_KEY found.");
            throw new Error("Missing GEMINI_API_KEY");
        }

        let text = null;
        let lastError = null;

        for (const candidate of FALLBACK_MODELS) {
            try {
                const candidateModel = genAI.getGenerativeModel({ model: candidate });
                const chat = candidateModel.startChat({
                    history: geminiHistory,
                    generationConfig: {
                        maxOutputTokens: 1000,
                    },
                });
                const result = await chat.sendMessage(message);
                const response = await result.response;
                text = response.text();
                if (text) break;
            } catch (err) {
                lastError = err;
                console.warn(`Model ${candidate} failed: ${err.message}, trying next...`);
            }
        }

        if (text) {
            return { role: 'assistant', content: text };
        }

        throw lastError || new Error("All Gemini models failed to respond.");

    } catch (error) {
        console.error("Gemini AI Error:", error);
        let errorMsg = error.message;

        // --- Fallback Mock Logic ---
        console.log("Switching to Fallback Mock AI due to error.");

        const lastUserMessage = message.toLowerCase();

        // Smart(er) Fallback
        if (lastUserMessage.includes("book") || lastUserMessage.includes("ticket")) {
            return { role: "assistant", content: `(Offline Mode - Gemini Error: ${errorMsg}) I'd be happy to help you book tickets! We have Adults ($20), Children ($10), and VIP ($50). When would you like to visit?` };
        }

        // Regex for date
        if (lastUserMessage.match(/\b(tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|202[0-9])\b/)) {
            return { role: "assistant", content: `(Offline Mode) Got it. We have Morning (09-12), Afternoon (12-15), and Evening (15-18) slots available. Which time works best for you?` };
        }

        // Regex for time
        if (lastUserMessage.match(/\b(morning|afternoon|evening|10|12|3)\b/)) {
            return { role: "assistant", content: `(Offline Mode) Great. How many tickets do you need? (e.g., 2 Adults, 1 Child)` };
        }

        // Regex for tickets (simple)
        if (lastUserMessage.match(/\d+/) && (lastUserMessage.includes("adult") || lastUserMessage.includes("child") || lastUserMessage.includes("vip"))) {
            return {
                role: "assistant",
                content: `(Offline Mode) Perfect. I've prepared that for you.
:::JSON
{
    "booking_ready": true,
    "summary": "Booking for selected tickets",
    "details": {
        "date": "2023-11-15",
        "slot_label": "Morning (09:00 - 12:00)",
        "tickets": { "Adult": 2, "Child": 1 }
    }
}
:::
Please click confirm to proceed.`
            };
        }

        return { role: "assistant", content: `(Offline Mode) I'm having trouble connecting to the Gemini AI (${errorMsg}). Please tell me: Date, Time Slot, and Number of Tickets.` };
    }
}

module.exports = { processChat };
