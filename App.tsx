import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ValidatorForm from './components/ValidatorForm';
import ResultCard from './components/ResultCard';
import KeyPocket from './components/KeyPocket';
import ReissueGuide from './components/ReissueGuide';
import { ValidationResult, HistoryItem, Provider } from './types';
import { validateApiKey } from './services/validationService';
import { saveKeyToHistory, getHistory, deleteKeyFromHistory, getDecryptedKey } from './utils/storage';

const App: React.FC = () => {
  const [currentResult, setCurrentResult] = useState<ValidationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State to pass selected key to ValidatorForm
  const [selectedKeyForForm, setSelectedKeyForForm] = useState<{provider: Provider, key: string, appName: string, alias: string} | null>(null);
  
  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleValidate = async (provider: Provider, apiKey: string, appName: string, alias: string) => {
    setLoading(true);
    setCurrentResult(null);
    
    try {
      const result = await validateApiKey(provider, apiKey);
      setCurrentResult(result);
      
      // Auto-save/update history upon validation attempt
      saveKeyToHistory(provider, apiKey, appName, alias, result.success);
      setHistory(getHistory());

    } catch (error) {
      console.error("Validation failed unexpectedly", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // Redundant with auto-save but kept for interface consistency if needed later
    setHistory(getHistory());
  };

  const handleSelectFromPocket = (item: HistoryItem) => {
    const key = getDecryptedKey(item.id);
    if (key) {
      // Populate form and scroll up
      setSelectedKeyForForm({
        provider: item.provider,
        key: key,
        appName: item.appName,
        alias: item.alias
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentResult(null); // Clear previous result to show form
    } else {
      alert("키를 복호화할 수 없습니다.");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 키를 주머니에서 빼내시겠습니까?')) {
      deleteKeyFromHistory(id);
      setHistory(getHistory());
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
    setSelectedKeyForForm(null);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Intro Text */}
        <div className="text-center space-y-2 mb-8 pt-4">
          <h2 className="text-3xl font-extrabold text-stone-800">
            나만의 API 키 주머니
          </h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            프로젝트별로 API 키를 안전하게 정리하고,<br/>필요할 때 바로 꺼내 확인하세요.
          </p>
        </div>

        {/* Validation Area */}
        {currentResult ? (
          <ResultCard 
            result={currentResult} 
            onSave={handleSave} 
            onReset={handleReset}
            isSaving={false}
          />
        ) : (
          <ValidatorForm 
            onValidate={handleValidate} 
            isLoading={loading} 
            selectedKeyData={selectedKeyForForm}
          />
        )}

        {/* Pocket Area */}
        <KeyPocket 
          history={history} 
          onSelect={handleSelectFromPocket} 
          onDelete={handleDelete} 
        />

        <div className="border-t border-stone-200 my-8"></div>
        
        {/* Reissue Guide */}
        <ReissueGuide />

      </div>
    </Layout>
  );
};

export default App;
