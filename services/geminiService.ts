import { GoogleGenerativeAI } from "@google/generative-ai";

// We use a lightweight model for validation
const VALIDATION_MODEL = 'gemini-1.5-flash';

export const validateGeminiKey = async (apiKey: string): Promise<{ success: boolean; status: number; message: string; model: string; usage?: string }> => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // We attempt to generate a very small content to validate the key
    const model = genAI.getGenerativeModel({ model: VALIDATION_MODEL });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
      generationConfig: {
        maxOutputTokens: 5,
      }
    });

    const response = await result.response;
    const text = response.text();

    if (text) {
      // Note: The public SDK doesn't easily expose 'quota' or 'remain' details in the response body.
      // Usually, it's in the response headers which are abstracted away.
      // We'll show a "Checking completed" status.
      return {
        success: true,
        status: 200,
        message: 'API 키가 유효하며 정상적으로 통신할 수 있습니다.',
        model: VALIDATION_MODEL,
        usage: '정상 (무료/유료 할당량 내 작동 중)'
      };
    } else {
      throw new Error('응답은 성공했으나 내용이 비어있습니다.');
    }

  } catch (error: any) {
    console.error("Gemini Validation Error:", error);

    let status = 500;
    let message = error.message || "알 수 없는 오류가 발생했습니다.";

    // Mapping to user-friendly Korean error messages
    if (message.includes('API_KEY_INVALID') || message.includes('API key not valid') || message.includes('401')) {
      status = 401;
      message = '유효하지 않은 API 키입니다. 키를 다시 확인하거나 신규 발급이 필요합니다.';
    } else if (message.includes('permission denied') || message.includes('403')) {
      status = 403;
      message = '해당 API 키에 대한 권한이 없습니다. 모델(Gemini 1.5) 사용 권한을 확인하세요.';
    } else if (message.includes('quota exceeded') || message.includes('429')) {
      status = 429;
      message = 'API 사용량(할당량)을 모두 소진했습니다. 내일 다시 시도하거나 유료 플랜을 확인하세요.';
    } else if (message.includes('model not found') || message.includes('not found')) {
      status = 404;
      message = `지정한 모델(${VALIDATION_MODEL})을 찾을 수 없습니다. 서비스 지역 또는 설정 확인이 필요합니다.`;
    }

    return {
      success: false,
      status,
      message,
      model: VALIDATION_MODEL,
      usage: status === 429 ? '소진됨' : '확인 불가'
    };
  }
};