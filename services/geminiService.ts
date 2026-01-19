import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are a focus coach AI inside a minimalist "lock-in" app. 
Your persona is calm, aesthetic, short, and motivating. 
You encourage deep work without sounding robotic or overly enthusiastic.
Messages should feel human, minimal, and vibe-based.
Keep responses under 20 words.
Do not use emojis unless absolutely necessary for the vibe (max 1).
Use lowercase often for a chill aesthetic, but maintain readability.
`;

export const getMotivationalMessage = async (intent: string, duration: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user wants to "${intent}" for ${duration} minutes. Give them a short, cool, vibe-based starting phrase to lock in.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text?.trim() || "time to lock in. let's flow.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "focus mode active. you got this.";
  }
};

export const getInterventionMessage = async (intent: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user is tempted to quit their session focused on "${intent}". 
      Do NOT just repeat the intent.
      Instead, hit them with a short, deep, personal question about why they are avoiding the work. 
      Or provide a stoic reality check about their potential.
      Make it feel like a text from a disappointed mentor.
      Keep it under 15 words. Lowercase.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text?.trim() || "why are you running from yourself?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "stay with the feeling. don't distract yourself.";
  }
};

export const getCompletionMessage = async (intent: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user finished their ${intent} session. Give them a short, low-key praise.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text?.trim() || "session clear. well done.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "session complete. good work.";
  }
};
