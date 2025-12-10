"use client";

import { useAppStore } from "@/store/app";
import { useEffect, useState } from "react";

//  Helper localStorage/
function safeReadLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to parse localStorage key: ${key}`, err);
    return null;
  }
}

//  useData — ARRAY VERSION
export function useData<T>(endpoint: string) {
  const { language } = useAppStore();

  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    try {
      const keyOriginal = `sheet_${endpoint}__id`;
      const keyLang = `sheet_${endpoint}__${language}`;

      // 1. Cek versi language (translated)
      if (language !== "id") {
        const translated = safeReadLS<T[]>(keyLang);

        if (translated) {
          if (active) setData(translated);
          setIsLoading(false);
          return;
        } else {
          console.warn(`No translated data for "${endpoint}" (${language})`);
        }
      }

      // 2. Fallback ke versi original
      const original = safeReadLS<T[]>(keyOriginal);

      if (original) {
        if (active) setData(original);
      } else {
        console.error(`No original data found for: ${endpoint}`);
        if (active) setData([]); // fallback
        setError(`Data for "${endpoint}" not found`);
      }
    } catch (err) {
      console.error(`useData(${endpoint}) error:`, err);
      if (active) {
        setError("Failed to load data from localStorage");
        setData([]);
      }
    }

    setIsLoading(false);

    return () => {
      active = false;
    };
  }, [endpoint, language]);

  return { data, isLoading, error };
}


//  useSingleData — OBJECT VERSION
export function useSingleData<T>(endpoint: string) {
  const { language } = useAppStore();

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    try {
      const keyOriginal = `sheet_${endpoint}__id`;
      const keyLang = `sheet_${endpoint}__${language}`;

      // 1. Cek versi translated
      if (language !== "id") {
        const translated = safeReadLS<T[]>(keyLang);
        if (translated && translated.length > 0) {
          if (active) setData(translated[0]);
          setIsLoading(false);
          return;
        } else {
          console.warn(`No translated single-data for ${endpoint} (${language})`);
        }
      }

      // 2. Fallback ke versi original
      const original = safeReadLS<T[]>(keyOriginal);

      if (original && original.length > 0) {
        if (active) setData(original[0]);
      } else {
        if (active) setData(null);
        setError(`Data "${endpoint}" unavailable`);
      }
    } catch (err) {
      if (active) {
        setError("Failed to load data");
        setData(null);
      }
    }

    setIsLoading(false);

    return () => {
      active = false;
    };
  }, [endpoint, language]);

  return { data, isLoading, error };
}
