import { BibleVersion, SearchResult, DailyVerse, CompareResult, Topic, Citation } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? 'API request failed');
  }
  return res.json() as Promise<T>;
}

export async function fetchVersions(): Promise<BibleVersion[]> {
  return apiFetch<BibleVersion[]>('/api/versions');
}

export async function searchVerses(
  q: string,
  versions: string[] = ['KJV'],
  limit = 20
): Promise<SearchResult[]> {
  const params = new URLSearchParams({ q, versions: versions.join(','), limit: String(limit) });
  return apiFetch<SearchResult[]>(`/api/search?${params}`);
}

export async function getDailyVerse(version = 'KJV'): Promise<DailyVerse> {
  return apiFetch<DailyVerse>(`/api/daily?version=${version}`);
}

export async function getVerse(
  version: string,
  book: string,
  chapter: number,
  verse: number
): Promise<SearchResult & { crossReferences: Citation[] }> {
  return apiFetch(`/api/verse/${encodeURIComponent(version)}/${encodeURIComponent(book)}/${chapter}/${verse}`);
}

export async function compareVerses(
  book: string,
  chapter: number,
  verse: number,
  versions: string[]
): Promise<CompareResult> {
  const params = new URLSearchParams({ book, chapter: String(chapter), verse: String(verse), versions: versions.join(',') });
  return apiFetch<CompareResult>(`/api/compare?${params}`);
}

export async function fetchTopics(): Promise<Topic[]> {
  return apiFetch<Topic[]>('/api/topics');
}

export async function fetchTopicVerses(
  topicName: string,
  versions: string[] = ['KJV']
): Promise<{ topic: Topic; verses: SearchResult[] }> {
  const params = new URLSearchParams({ versions: versions.join(',') });
  return apiFetch(`/api/topics/${encodeURIComponent(topicName)}/verses?${params}`);
}

export async function getBookmarks(token: string): Promise<SearchResult[]> {
  return apiFetch('/api/bookmarks', { headers: { Authorization: `Bearer ${token}` } });
}

export async function addBookmark(token: string, verseId: string, note?: string): Promise<void> {
  await apiFetch('/api/bookmarks', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ verseId, note }),
  });
}

export async function deleteBookmark(token: string, verseId: string): Promise<void> {
  await apiFetch(`/api/bookmarks/${verseId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
