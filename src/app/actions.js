'use server';

import Groq from "groq-sdk";

const api_key = process.env.GROQ_API_KEY;

let groq;

export async function getGroqResponse(messages) {
    if (!api_key) {
        console.error("GROQ_API_KEY is missing in environment variables.");
        return "Error: System configuration missing (API Key). Please add GROQ_API_KEY to your .env file.";
    }

    if (!groq) {
        groq = new Groq({ apiKey: api_key });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
        });
        return chatCompletion.choices[0]?.message?.content || "I apologize, but I couldn't process that.";
    } catch (err) {
        console.error("Groq API Error:", err);
        return "Sorry, I'm having trouble connecting right now.";
    }
}
