import React, { useMemo } from 'react';
import { HistoryItem, Provider } from '../types';

interface KeyPocketProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

const KeyPocket: React.FC<KeyPocketProps> = ({ history, onSelect, onDelete }) => {
  // Group history items by appName
  const groupedKeys = useMemo(() => {
    const groups: Record<string, HistoryItem[]> = {};
    history.forEach(item => {
      const app = item.appName || '미지정 프로젝트';
      if (!groups[app]) {
        groups[app] = [];
      }
      groups[app].push(item);
    });
    return groups;
  }, [history]);

  const appNames = Object.keys(groupedKeys).sort();

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProviderColor = (p: Provider) => {
    switch(p) {
        case Provider.GEMINI: return "bg-blue-100 text-blue-700 border-blue-200";
        case Provider.OPENAI: return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case Provider.CLAUDE: return "bg-purple-100 text-purple-700 border-purple-200";
    }
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-12 text-center">
        <div className="text-6xl mb-4">👜</div>
        <h3 className="text-xl font-bold text-stone-700 mb-2">주머니가 비어있어요</h3>
        <p className="text-stone-500">
          위의 입력창에 본인의 API 키를 입력하고<br/>
          '검증하고 주머니에 넣기'를 눌러보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold text-stone-800">내 API 키 주머니</h3>
        <span className="text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
          총 {Object.keys(groupedKeys).length}개의 프로젝트
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {appNames.map((appName) => (
          <div key={appName} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 bg-orange-50/50 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📂</span>
                <h4 className="text-lg font-bold text-stone-800">{appName}</h4>
              </div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                {groupedKeys[appName].length} keys
              </span>
            </div>

            <div className="divide-y divide-stone-50">
              {groupedKeys[appName].map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-stone-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getProviderColor(item.provider)} uppercase`}>
                            {item.provider}
                        </span>
                        <span className="font-medium text-stone-700">{item.alias}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-stone-400">
                        <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 font-mono text-xs">{item.maskedKey}</code>
                        <span>•</span>
                        <span className={`${item.status === 'valid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                             {item.status === 'valid' ? '● 유효함' : '● 확인 필요'}
                        </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onSelect(item)}
                        className="px-4 py-2 bg-white border border-stone-200 hover:border-orange-300 hover:text-orange-600 text-stone-600 text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                        불러오기
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="삭제"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyPocket;
