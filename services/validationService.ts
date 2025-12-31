import { Provider, ValidationResult } from '../types';
import { validateGeminiKey } from './geminiService';

export const validateApiKey = async (provider: Provider, apiKey: string): Promise<ValidationResult> => {
  const startTime = Date.now();
  let result = {
    success: false,
    status: 0,
    message: '',
    model: ''
  };

  try {
    switch (provider) {
      case Provider.GEMINI:
        result = await validateGeminiKey(apiKey);
        break;
        
      case Provider.OPENAI:
        // Note: Direct browser calls to OpenAI often fail due to CORS. 
        // Real implementation requires a backend proxy as per PRD.
        // For this frontend-only demo, we simulate a check or try a fetch that might fail.
        result = await simulateOpenAICheck(apiKey);
        break;
        
      case Provider.CLAUDE:
        // Similar CORS restriction for Anthropic.
        result = await simulateClaudeCheck(apiKey);
        break;
        
      default:
        throw new Error('지원하지 않는 제공자입니다.');
    }
  } catch (e: any) {
    result = {
      success: false,
      status: 500,
      message: e.message,
      model: 'unknown'
    };
  }

  const endTime = Date.now();
  
  return {
    success: result.success,
    status: result.status,
    message: result.message,
    responseTime: endTime - startTime,
    provider,
    modelUsed: result.model,
    timestamp: endTime,
    recommendation: getRecommendation(result.status, provider)
  };
};

// Heuristic for recommendation based on status code
const getRecommendation = (status: number, provider: Provider): string => {
  if (status === 200) return '✅ 정상입니다. 별도 조치가 필요하지 않습니다.';
  if (status === 401) return '🔄 키가 유효하지 않습니다. 새 키를 발급받으세요.';
  if (status === 403) return '🚫 권한이 없습니다. 결제 상태나 권한 범위를 확인하세요.';
  if (status === 429) return '⏳ 사용량 초과(Rate Limit). 잠시 후 다시 시도하세요.';
  if (status === 0) return '⚠️ 네트워크/CORS 오류. 실제 서비스에서는 백엔드 프록시가 필요합니다.';
  return '❓ 알 수 없는 오류. 제공자 상태를 확인하세요.';
};

// Simulation/Mock for CORS-restricted APIs in a frontend-only environment
const simulateOpenAICheck = async (key: string) => {
  // Basic regex check for OpenAI key format sk-...
  if (!key.startsWith('sk-')) {
    return { success: false, status: 400, message: '형식 오류: OpenAI 키는 보통 "sk-"로 시작합니다.', model: 'gpt-4o-mini' };
  }
  
  try {
    // Attempt a real fetch - this WILL fail with CORS in most browsers without a proxy
    // We catch the error and return a specific message about the Backend requirement
    const res = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: { Authorization: `Bearer ${key}` }
    });
    
    return {
      success: res.ok,
      status: res.status,
      message: res.ok ? '키가 유효합니다.' : res.statusText,
      model: 'gpt-4o-mini'
    };
  } catch (e) {
    // If it's a network error (likely CORS), we inform the user
    return { 
      success: false, 
      status: 0, 
      message: 'CORS 차단됨: OpenAI는 브라우저 직접 호출을 허용하지 않습니다. (PRD 참조)', 
      model: 'gpt-4o-mini' 
    };
  }
};

const simulateClaudeCheck = async (key: string) => {
   if (!key.startsWith('sk-ant-')) {
    return { success: false, status: 400, message: '형식 오류: Claude 키는 보통 "sk-ant-"로 시작합니다.', model: 'claude-3-haiku' };
  }
  // Anthropic is strict about CORS.
  return { 
      success: false, 
      status: 0, 
      message: 'CORS 차단됨: Anthropic은 백엔드 프록시가 필요합니다. 이 데모는 프론트엔드 전용입니다.', 
      model: 'claude-3-haiku' 
  };
};