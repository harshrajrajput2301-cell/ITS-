import { GoogleGenAI } from "@google/genai";

export const generateAnnouncement = async (
  context: string,
  tone: 'professional' | 'urgent' | 'friendly'
): Promise<string> => {
  // Safety check for API Key
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing in environment variables.");
    return "Error: API Key missing. Please configure your environment.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are an assistant for a school teacher. 
      Write a short, clear announcement for students based on the following context: "${context}".
      Tone: ${tone}.
      Keep it under 50 words.
      Do not include placeholders like [Your Name], just write the body text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Could not generate announcement.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate announcement via AI. Please try again.";
  }
};