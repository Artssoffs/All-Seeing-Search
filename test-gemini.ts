import { GoogleGenAI, Type } from "@google/genai";
async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Hello",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            timestamp: { type: Type.STRING },
          }
        }
      }
    });
    console.log("Success:", response.text);
  } catch (e: any) {
    console.error("Caught error:", e.message);
    if (e.name) console.error("Name:", e.name);
  }
}
run();
