import { HistoryItem, Provider } from '../types';

const STORAGE_KEY = 'apikey_validator_pocket_v2'; // Changed key to avoid conflict with old schema

const encrypt = (text: string) => btoa(text);
const decrypt = (text: string) => atob(text);

export const saveKeyToHistory = (
  provider: Provider,
  apiKey: string,
  appName: string,
  alias: string,
  isValid: boolean
): HistoryItem => {
  const history = getHistory();
  
  // Check if key already exists (decrypt to compare)
  const existingIndex = history.findIndex(item => decrypt(item.encryptedKey) === apiKey);
  
  const newItem: HistoryItem = {
    id: existingIndex >= 0 ? history[existingIndex].id : crypto.randomUUID(),
    provider,
    appName: appName || '미지정 프로젝트',
    alias: alias || `${provider.charAt(0).toUpperCase() + provider.slice(1)} Key`,
    maskedKey: `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`,
    lastChecked: Date.now(),
    status: isValid ? 'valid' : 'invalid',
    encryptedKey: encrypt(apiKey),
  };

  if (existingIndex >= 0) {
    history.splice(existingIndex, 1);
    history.unshift(newItem);
  } else {
    history.unshift(newItem);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return newItem;
};

export const getHistory = (): HistoryItem[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const deleteKeyFromHistory = (id: string): HistoryItem[] => {
  const history = getHistory().filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return history;
};

export const getDecryptedKey = (id: string): string | null => {
  const item = getHistory().find(i => i.id === id);
  return item ? decrypt(item.encryptedKey) : null;
};
