import { GoogleGenerativeAI } from "@google/generative-ai";

// We use a lightweight model for validation
// Update to Gemini 2.0 Flash for 2026 compatibility
const VALIDATION_MODEL = 'gemini-2.0-flash';

export const validateGeminiKey = async (apiKey: string): Promise<{ success: boolean; status: number; message: string; model: string; usage?: string }> => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // --- Stage 1: metadata check (very light, often doesn't hit generation RPM) ---
    try {
      // Intentionally using a simple model list to check key validity
      await genAI.getGenerativeModel({ model: VALIDATION_MODEL }).getProperties();
      // If getProperties() is not available in this SDK version, we'll catch and move to Stage 2
    } catch (e: any) {
      // If it's a 401 or specific auth error here, we can exit early
      if (e.message?.includes('401') || e.message?.includes('API_KEY_INVALID')) {
        return {
          success: false,
          status: 401,
          message: '유효하지 않은 API 키입니다.',
          model: VALIDATION_MODEL
        };
      }
      // Otherwise, proceed to Stage 2 for a real test
    }

    // --- Stage 2: functionality check ('ping') ---
    const model = genAI.getGenerativeModel({ model: VALIDATION_MODEL });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
      generationConfig: { maxOutputTokens: 2 }
    });

    const response = await result.response;
    const text = response.text();

    if (text) {
      return {
        success: true,
        status: 200,
        message: 'API 키가 유효하며 정상적으로 통신할 수 있습니다.',
        model: VALIDATION_MODEL,
        usage: '정상 (쿼터 활성화됨)'
      };
    } else {
      throw new Error('응답 내용이 비어있습니다.');
    }

  } catch (error: any) {
    console.error("Gemini Validation Error:", error);

    let status = 500;
    let errMsg = error.message || "";
    let message = "알 수 없는 오류가 발생했습니다.";

    if (errMsg.includes('401') || errMsg.includes('API_KEY_INVALID')) {
      status = 401;
      message = '유효하지 않은 API 키입니다. 키를 다시 확인해 주세요.';
    } else if (errMsg.includes('403') || errMsg.includes('permission denied')) {
      status = 403;
      message = '권한 오류(403). 결제 계정 미연결 또는 지역 제한일 가능성이 높습니다.';
    } else if (errMsg.includes('429') || errMsg.includes('quota exceeded')) {
      status = 429;
      message = '사용량 초과(429). 같은 IP에서 여러 계정의 키를 단시간에 시도할 경우 정책상 차단될 수 있습니다. 1~2분 후 다시 시도하거나 네트워크(IP)를 바꿔보세요.';
    } else if (errMsg.includes('404') || errMsg.includes('not found')) {
      status = 404;
      message = `모델(${VALIDATION_MODEL})을 찾을 수 없습니다. API 설정을 확인하세요.`;
    }

    return {
      success: false,
      status,
      message,
      model: VALIDATION_MODEL,
      usage: status === 429 ? '소진/IP차단' : '확인 불가'
    };
  }
};
