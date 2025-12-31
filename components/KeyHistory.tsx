import React from 'react';
import { HistoryItem, Provider } from '../types';

interface KeyHistoryProps {
  history: HistoryItem[];
  onRetest: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

const KeyHistory: React.FC<KeyHistoryProps> = ({ history, onRetest, onDelete }) => {
  if (history.length === 0) return null;

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProviderBadge = (p: Provider) => {
    switch (p) {
      case Provider.GEMINI:
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200">Gemini</span>;
      case Provider.OPENAI:
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-200">OpenAI</span>;
      case Provider.CLAUDE:
        return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded border border-purple-200">Claude</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">저장된 키</h3>
        <span className="text-sm text-gray-500">총 {history.length}개</span>
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {getProviderBadge(item.provider)}
                <span className="font-medium text-gray-900 truncate">{item.alias}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{item.maskedKey}</code>
                <span>•</span>
                <span>{formatDate(item.lastChecked)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                item.status === 'valid' ? 'bg-green-100 text-green-800' : 
                item.status === 'invalid' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {item.status === 'valid' ? '● 유효' : '● 무효'}
              </span>
              
              <div className="flex border-l border-gray-200 pl-3 space-x-2">
                <button
                  onClick={() => onRetest(item)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="다시 테스트"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="키 삭제"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyHistory;