
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProductCopy = async (
  productName: string, 
  category: string, 
  subCategory?: string
): Promise<{ title: string; description: string; studentHook: string }> => {
  const context = subCategory ? `${subCategory} ${category}` : category;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a compelling student-focused marketing copy for a product named "${productName}" in the category "${context}". 
    The tone should be savvy, relatable, and highlight why it's perfect for a student lifestyle. 
    If it's a book, mention why it's a great break from studying or a great resource for learning. 
    If it's a gadget, focus on productivity or dorm life convenience.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy student-centric title." },
          description: { type: Type.STRING, description: "Detailed benefits for a student." },
          studentHook: { type: Type.STRING, description: "A one-sentence punchy hook." }
        },
        required: ["title", "description", "studentHook"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      title: productName,
      description: "Excellent find for busy students looking to balance wellness, learning, and productivity.",
      studentHook: "The ultimate student companion."
    };
  }
};
