export enum Provider {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  CLAUDE = 'claude',
}

export interface ValidationResult {
  success: boolean;
  status: number;
  message: string;
  responseTime: number;
  provider: Provider;
  modelUsed?: string;
  timestamp: number;
  recommendation: string;
}

export interface HistoryItem {
  id: string;
  provider: Provider;
  appName: string; // Changed/Added: Grouping by WebApp Name
  alias: string;   // Specific alias for the key itself (optional)
  maskedKey: string;
  lastChecked: number;
  status: 'valid' | 'invalid' | 'unknown';
  encryptedKey: string; 
}

export interface ValidationRequest {
  provider: Provider;
  apiKey: string;
  appName?: string;
}
