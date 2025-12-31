import React from 'react';

const ReissueGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
      <h3 className="text-lg font-bold text-stone-800 mb-4">재발급 가이드</h3>
      <div className="space-y-3">
        {/* Helper Links */}
        <div className="flex flex-wrap gap-2 mb-4">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            Gemini 키 발급/갱신 ↗
          </a>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
          >
            OpenAI 키 발급/갱신 ↗
          </a>
        </div>

        {/* Red - Must Reissue */}
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-rose-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-bold text-rose-800">재발급 필수 (즉시)</span>
          </div>
          <ul className="list-disc list-inside text-sm text-rose-700 space-y-1 ml-1">
            <li>401/403 에러 발생 (인증/권한 실패)</li>
            <li>GitHub 등 공개 저장소에 키 노출</li>
            <li>키가 무효화되었다는 메시지 수신</li>
          </ul>
        </div>

        {/* Yellow - Consider */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-bold text-amber-800">재발급 고려</span>
          </div>
          <ul className="list-disc list-inside text-sm text-amber-700 space-y-1 ml-1">
            <li>오래된 키 형식 (예: sk-... → sk-proj-...)</li>
            <li>6개월 이상 미사용 후 재사용</li>
            <li>보안 강화 필요시 (주기적 교체)</li>
          </ul>
        </div>

        {/* Green - No Need */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-bold text-emerald-800">재발급 불필요</span>
          </div>
          <ul className="list-disc list-inside text-sm text-emerald-700 space-y-1 ml-1">
            <li>키가 정상 작동하는 경우</li>
            <li>단순히 오래되었다는 이유만으로 교체 불필요</li>
            <li>일시적인 서버 오류 (500, 503)</li>
            <li>Rate limit 초과 (429) - 잠시 대기 후 재시도</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReissueGuide;
