// hooks/useLocalizedData.tsx
'use client';
import { useEffect, useState } from "react";
import { useLang } from "@/context/LanguageContext"; // asumsi ada
// overload
export function useLocalizedData<T>(endpoint: string, options: { type: "array" }): { data: T[] | null; isLoading: boolean; error: string | null; };
export function useLocalizedData<T>(endpoint: string, options: { type: "single" }): { data: T | null; isLoading: boolean; error: string | null; };

export function useLocalizedData<T>(endpoint: string, options: { type: "array" | "single" }) {
  const [data, setData] = useState<T | T[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { language } = useLang();

  const CACHE_KEY = `portfolio_${endpoint}_${language}`;

  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setData(parsed);
          setIsLoading(false);
          return;
        }

        const res = await fetch(`/api/${endpoint}?lang=${language}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint} lang=${language}`);
        const json = await res.json();

        const out = options.type === "single" ? (Array.isArray(json) ? json[0] : json) : json;

        localStorage.setItem(CACHE_KEY, JSON.stringify(out));
        if (active) setData(out);
      } catch (err: any) {
        console.error("useLocalizedData error", err);
        if (active) setError(String(err));
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [endpoint, language]);

  return { data: (data as any), isLoading, error };
}
