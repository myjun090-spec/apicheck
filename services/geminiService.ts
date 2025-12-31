import { GoogleGenAI } from "@google/genai";

// We use a lightweight model for validation
const VALIDATION_MODEL = 'gemini-2.5-flash-latest';

export const validateGeminiKey = async (apiKey: string): Promise<{ success: boolean; status: number; message: string; model: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We attempt to generate a very small content to validate the key
    const response = await ai.models.generateContent({
      model: VALIDATION_MODEL,
      contents: { parts: [{ text: 'ping' }] },
      config: {
        maxOutputTokens: 5,
      }
    });

    if (response && response.text) {
      return {
        success: true,
        status: 200,
        message: 'API 키가 유효하며 정상 작동합니다.',
        model: VALIDATION_MODEL
      };
    } else {
      throw new Error('응답 내용이 없습니다.');
    }

  } catch (error: any) {
    console.error("Gemini Validation Error:", error);

    let status = 500;
    let message = error.message || "알 수 없는 오류 발생";

    // Attempt to map error codes if available in the error object
    // The SDK might throw errors with specific properties
    if (error.status) status = error.status;
    if (message.includes('401') || message.includes('API key not valid')) status = 401;
    if (message.includes('403')) status = 403;
    if (message.includes('429')) status = 429;

    // Translate common error parts if needed, but usually SDK messages are English.
    // We can wrap them or leave them as technical details.
    
    return {
      success: false,
      status,
      message,
      model: VALIDATION_MODEL
    };
  }
};