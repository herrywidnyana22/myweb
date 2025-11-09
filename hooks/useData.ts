'use client';

import { useState, useEffect } from 'react';

export function useData<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/${endpoint}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const json = await res.json();
        if (active) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        if (active) setError(`Failed to load ${endpoint}`);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [endpoint]);

  return { data, isLoading, error };
}


export function useSingleData<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/${endpoint}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const json = await res.json();

        if (active) {
          setData(Array.isArray(json) ? json[0] : json);
          setError(null);
        }
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        if (active) setError(`Failed to load ${endpoint}`);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [endpoint]);

  return { data, isLoading, error };
}

