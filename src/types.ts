import { GeneratedPitch } from './services/aiService';

export type PipelineStage = 'Triage / Purgatory' | 'The Bleeding (Diagnoza)' | 'The Blueprint (Architektura)' | 'The Execution (Decyzja)';

export interface LeadHistoryItem {
  id: string;
  date: string;
  type: 'call' | 'note' | 'email';
  content: string;
  nextContact?: string;
  author: string;
}

export interface Lead {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  province: string;
  industry: string;
  problem: string;
  scale: string;
  stage: PipelineStage;
  status: 'ZALEGŁY' | 'DO SPRZEDAŻY' | 'W TOKU' | 'NOWY' | 'OVERDUE' | 'FOR SALES' | 'IN PROGRESS' | 'NEW';
  owner: string;
  consultant?: string;
  nextContact: string;
  lastContact: string;
  history: LeadHistoryItem[];
  pitch?: GeneratedPitch;
  emailDraft?: string;
  selectedSolutions: string[];
}

