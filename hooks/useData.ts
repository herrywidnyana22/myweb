"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContextProps";

// TTL default: 10 menit
const DEFAULT_TTL = 1000 * 60 * 10;

function getLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function setLS(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

function isExpired(key: string, ttl: number): boolean {
  const last = localStorage.getItem(`${key}__lastUpdated`);
  if (!last) return true;
  return Date.now() - Number(last) > ttl;
}

function markUpdated(key: string) {
  localStorage.setItem(`${key}__lastUpdated`, String(Date.now()));
}

/* =======================================================================
   useData (ARRAY VERSION)
   ======================================================================= */
export function useData<T>(endpoint: string, ttl = DEFAULT_TTL) {
  const { language } = useApp();
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const keyOriginal = `sheet_${endpoint}__id`;
  const keyLang = `sheet_${endpoint}__${language}`;

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      // cek cache versi language
      const cachedLang = getLS<T[]>(keyLang);
      if (cachedLang) {
        setData(cachedLang);
        setIsLoading(false);
        return;
      }

      // cek cache original bila language = id
      if (language === "id") {
        const cachedOriginal = getLS<T[]>(keyOriginal);
        if (cachedOriginal) {
          setData(cachedOriginal);
          setIsLoading(false);
          return;
        }
      }

      // fetch API
      if (isExpired(`sheet_${endpoint}`, ttl)) {
        try {
          const res = await fetch(`/api/${endpoint}`, { cache: "no-store" });
          if (!res.ok) throw new Error(`Failed to fetch /api/${endpoint}`);

          const json = await res.json();

          // simpan original
          setLS(keyOriginal, json);
          markUpdated(`sheet_${endpoint}`);

          if (language === "id") {
            setData(json);
          }

        } catch (err) {
          console.error(`Error fetching ${endpoint}:`, err);
          if (active) setError(`Failed to load ${endpoint}`);
        }
      } else {
        // TTL belum habis → ambil original
        const cachedOriginal = getLS<T[]>(keyOriginal);
        if (cachedOriginal) {
          setData(cachedOriginal);
        }
      }

      setIsLoading(false);
    };

    load();
    return () => {
      active = false;
    }
  }, [endpoint, language, ttl]);

  return { data, isLoading, error };
}

/* =======================================================================
   useSingleData (SINGLE VERSION)
   ======================================================================= */
export function useSingleData<T>(endpoint: string, ttl = DEFAULT_TTL) {
  const { language } = useApp();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const keyOriginal = `sheet_${endpoint}__id`;
  const keyLang = `sheet_${endpoint}__${language}`;

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      // cek versi bahasa
      const cachedLang = getLS<T>(keyLang);
      if (cachedLang) {
        setData(cachedLang);
        setIsLoading(false);
        return;
      }

      // cek versi original
      if (language === "id") {
        const cachedOriginal = getLS<T>(keyOriginal);
        if (cachedOriginal) {
          setData(cachedOriginal);
          setIsLoading(false);
          return;
        }
      }

      // fetch ke API
      if (isExpired(`sheet_${endpoint}`, ttl)) {
        try {
          const res = await fetch(`/api/${endpoint}`, { cache: "no-store" });
          if (!res.ok) throw new Error(`Failed to fetch /api/${endpoint}`);

          const json = await res.json();
          const parsed = Array.isArray(json) ? json[0] : json;

          setLS(keyOriginal, parsed);
          markUpdated(`sheet_${endpoint}`);

          if (language === "id") {
            setData(parsed);
          }

        } catch (err) {
          console.error(`Error fetching ${endpoint}:`, err);
          if (active) setError(`Failed to load ${endpoint}`);
        }
      } else {
        const cachedOriginal = getLS<T>(keyOriginal);
        if (cachedOriginal) setData(cachedOriginal);
      }

      setIsLoading(false);
    };

    load();

    return () => {
      active = false;
    };

  }, [endpoint, language, ttl]);

  return { data, isLoading, error };
}

