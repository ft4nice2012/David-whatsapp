
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const getGeminiResponse = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  systemInstruction: string = 'You are a helpful assistant.'
) => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // We use generateContent instead of chats.create for more explicit control over parts and system instructions
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: `System context: ${systemInstruction}` }] },
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      }
    });

    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! I hit a snag. Please try again in a moment.";
  }
};

export const streamGeminiResponse = async function* (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  systemInstruction: string = 'You are a helpful assistant.'
) {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: `System context: ${systemInstruction}` }] },
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        temperature: 0.8,
      }
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) yield text;
    }
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    yield "Error connecting to AI service.";
  }
};
