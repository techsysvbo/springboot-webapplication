// TypeScript types for the BibleAI chat application

export interface BibleVersion {
  id:           string;
  abbreviation: string;
  fullName:     string;
  language:     string;
  year?:        number;
  copyright:    string;
  description?: string;
  isDefault:    boolean;
  createdAt:    string;
}

export interface Citation {
  reference: string;
  text:      string;
  version:   string;
  bookName:  string;
  chapter:   number;
  verse:     number;
}

export type MessageRole = 'user' | 'assistant';
export type ResponseFormat = 'simple' | 'devotional' | 'academic' | 'deep_study';

export interface ChatMessage {
  id:         string;
  role:       MessageRole;
  content:    string;
  citations?: Citation[];
  isStreaming?: boolean;
  createdAt:  string;
}

export interface ChatSession {
  id:        string;
  title:     string;
  messages:  ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id:         string;
  reference:  string;
  bookName:   string;
  chapter:    number;
  verse:      number;
  text:       string;
  version:    string;
  similarity?: number;
}

export interface DailyVerse {
  reference: string;
  bookName:  string;
  chapter:   number;
  verse:     number;
  text:      string;
  version:   string;
  date:      string;
}

export interface CompareResult {
  reference:   string;
  bookName:    string;
  chapter:     number;
  verse:       number;
  comparisons: Array<{ version: string; text: string | null; found: boolean }>;
}

export interface Topic {
  id:          string;
  name:        string;
  description?: string;
  createdAt:   string;
  _count?:     { verses: number };
}
