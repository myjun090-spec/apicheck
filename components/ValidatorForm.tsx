import React, { useState, useEffect } from 'react';
import { Provider } from '../types';

interface ValidatorFormProps {
  onValidate: (provider: Provider, key: string, appName: string, alias: string) => void;
  isLoading: boolean;
  selectedKeyData?: { provider: Provider; key: string; appName: string; alias: string } | null;
}

const ValidatorForm: React.FC<ValidatorFormProps> = ({ onValidate, isLoading, selectedKeyData }) => {
  const [provider, setProvider] = useState<Provider>(Provider.GEMINI);
  const [apiKey, setApiKey] = useState('');
  const [appName, setAppName] = useState('');
  const [alias, setAlias] = useState('');
  const [showKey, setShowKey] = useState(false);

  // Effect to populate form when a key is selected from the Pocket
  useEffect(() => {
    if (selectedKeyData) {
      setProvider(selectedKeyData.provider);
      setApiKey(selectedKeyData.key);
      setAppName(selectedKeyData.appName);
      setAlias(selectedKeyData.alias);
    }
  }, [selectedKeyData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    onValidate(provider, apiKey.trim(), appName.trim(), alias.trim());
  };

  const getProviderIcon = (p: Provider) => {
    switch (p) {
      case Provider.GEMINI: return "✨";
      case Provider.OPENAI: return "🤖";
      case Provider.CLAUDE: return "🧠";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 via-rose-300 to-amber-300"></div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold text-stone-800">새로운 키 담기</h2>
        <p className="text-stone-500 text-sm mt-1 leading-relaxed">
          입력하신 키로 <strong>최소 단위의 요청(Ping)</strong>을 보내 유효성을 확인합니다.<br/>
          별도의 검증용 키는 필요하지 않으며, 확인 후 자동으로 주머니에 저장됩니다.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Provider Selection */}
        <div className="grid grid-cols-3 gap-3">
          {Object.values(Provider).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                provider === p
                  ? 'border-orange-400 bg-orange-50 text-orange-800'
                  : 'border-stone-100 hover:border-orange-200 hover:bg-stone-50 text-stone-600'
              }`}
            >
              <span className="text-2xl mb-2">{getProviderIcon(p)}</span>
              <span className="text-sm font-medium capitalize">{p}</span>
              {provider === p && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-400"></div>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* App Name Input (New) */}
            <div>
            <label htmlFor="appName" className="block text-sm font-medium text-stone-700 mb-1">
                프로젝트 (웹앱) 이름
            </label>
            <input
                id="appName"
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="예: 나만의 다이어리, 회사 홈페이지"
                className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all placeholder-stone-400 bg-stone-50 focus:bg-white"
            />
            </div>

            {/* Alias Input */}
            <div>
            <label htmlFor="alias" className="block text-sm font-medium text-stone-700 mb-1">
                키 설명 (선택)
            </label>
            <input
                id="alias"
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="예: 개발용, 배포용"
                className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all placeholder-stone-400 bg-stone-50 focus:bg-white"
            />
            </div>
        </div>

        {/* API Key Input */}
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-stone-700 mb-1">
            {provider} API Key <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="apiKey"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`${provider} API 키를 입력하세요`}
              required
              className="w-full pl-4 pr-12 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all placeholder-stone-400 font-mono text-sm bg-stone-50 focus:bg-white text-stone-800"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-stone-600 rounded-md hover:bg-stone-200 transition-colors"
            >
              {showKey ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !apiKey}
          className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-orange-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLoading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>검증 및 저장 중...</span>
            </span>
          ) : (
            '검증하고 주머니에 넣기'
          )}
        </button>
      </form>
    </div>
  );
};

export default ValidatorForm;