import { GoogleGenAI } from "@google/genai";
async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { inlineData: { mimeType: "image/jpeg", data: "inVhbGlkQmFzZTY0$#" } }
      ]
    });
    console.log("Success");
  } catch (e: any) {
    console.error("Caught error:", e.message);
  }
}
run();
