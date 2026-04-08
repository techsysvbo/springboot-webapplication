'use client';

import { useState, useEffect } from 'react';
import { BibleVersion } from '@/lib/types';
import { fetchVersions } from '@/lib/api';

export function useVersions() {
  const [versions, setVersions]     = useState<BibleVersion[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    fetchVersions()
      .then(setVersions)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { versions, isLoading, error };
}
