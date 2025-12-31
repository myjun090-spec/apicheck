import React from 'react';
import { ValidationResult, Provider } from '../types';

interface ResultCardProps {
  result: ValidationResult | null;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onSave, onReset, isSaving }) => {
  if (!result) return null;

  const isSuccess = result.success;

  // Color configuration based on status (Pastel)
  const getColors = () => {
    if (isSuccess) return 'bg-emerald-50 border-emerald-100 text-emerald-900';
    if (result.status === 401 || result.status === 403) return 'bg-rose-50 border-rose-100 text-rose-900';
    if (result.status === 0) return 'bg-amber-50 border-amber-100 text-amber-900';
    return 'bg-rose-50 border-rose-100 text-rose-900';
  };

  const getIcon = () => {
    if (isSuccess) {
      return (
        <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getReissueStatus = () => {
    if (isSuccess) return { text: '재발급 불필요', color: 'text-emerald-600 bg-emerald-100' };
    if (result.status === 401 || result.status === 403) return { text: '재발급 필수 (즉시)', color: 'text-rose-600 bg-rose-100' };
    if (result.status === 429) return { text: '재발급 불필요 (대기 필요)', color: 'text-amber-600 bg-amber-100' };
    return { text: '재발급 고려/상태 확인', color: 'text-amber-600 bg-amber-100' };
  };

  const status = getReissueStatus();

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up ${getColors()}`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-full shadow-sm">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold">
                  {isSuccess ? '검증 성공' : '검증 실패'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                  {status.text}
                </span>
              </div>
              <p className="text-sm opacity-80 mt-1">
                {result.message}
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium opacity-60 uppercase tracking-wide">응답 시간</div>
            <div className="text-xl font-mono font-bold">{result.responseTime}ms</div>
          </div>
        </div>

        <div className="mt-6 bg-white/60 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm backdrop-blur-sm border border-white/50">
          <div>
            <span className="block opacity-60 text-xs uppercase mb-1">상태 코드</span>
            <span className={`font-mono font-bold ${isSuccess ? 'text-emerald-700' : 'text-rose-700'}`}>
              {result.status || 'ERR'}
            </span>
          </div>
          <div>
            <span className="block opacity-60 text-xs uppercase mb-1">검증 모델</span>
            <span className="font-medium">{result.modelUsed}</span>
          </div>
          {result.usage && (
            <div className="sm:col-span-2">
              <span className="block opacity-60 text-xs uppercase mb-1">API 사용량</span>
              <span className="font-medium">{result.usage}</span>
            </div>
          )}
          <div className="sm:col-span-2">
            <span className="block opacity-60 text-xs uppercase mb-1">권장 조치</span>
            <span className="font-medium flex items-center">
              {result.recommendation}
            </span>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={onReset}
            className={`flex-1 font-bold py-3 px-4 rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${isSuccess
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
              }`}
          >
            다른 키 테스트
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
