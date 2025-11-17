// components/chat/useChatCore.ts
"use client";

import { useApp } from "@/context/AppContextProps";
import { useEffect, useReducer, useRef, useState, useCallback } from "react";
import { chatReducer } from "../lib/chat/chatReducer";
import { loadHistory, saveHistory } from "../lib/chat/chatHistory";
import { useChat } from "@/context/ChatContex";

export function useChatCore() {
  const { 
    messages: propMessages, 
    isMinimized, 
    setIsMinimized, 
    isInputFocused, 
    setIsInputFocused
   } = useChat();

  const [messages, dispatch] = useReducer(chatReducer, propMessages || []);
  const [input, setInput] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  
  const { chatMode, setChatMode } = useApp(); // ambil sekali saja
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedRef = useRef<boolean>(false);

  const onMinimize = useCallback(() => setIsMinimized((p: boolean) => !p), []);

  /* ================ MEMORY ================ */
  const getMemory = useCallback((): ChatMemory => {
    try {
      return JSON.parse(localStorage.getItem("chatMemory") || "{}");
    } catch {
      return {};
    }
  }, []);

  const saveMemory = useCallback(
    (newData: Partial<ChatMemory>) => {
      const current = getMemory();
      const updated = { ...current, ...newData };
      localStorage.setItem("chatMemory", JSON.stringify(updated));
    },
    [getMemory]
  );

  const detectUserName = useCallback(
    (msg: string): string | null => {
      const patterns = [
        /\b(?:nama saya|nama aku|namaku)\s+(adalah\s+)?([A-Za-zÀ-ÖØ-öø-ÿ]+)/i,
        /\bpanggil aku\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)/i,
        /\bmy name is\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)/i,
      ];

      for (const p of patterns) {
        const match = msg.match(p);
        if (match) {
          // prefer capture group 2 (bahasa id) else 1 (bahasa en)
          const name = match[2] ?? match[1];
          if (name) {
            saveMemory({ name });
            return name.trim();
          }
        }
      }
      return null;
    },
    [saveMemory]
  );

  /* ================ UI helpers ================ */
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const clearChat = useCallback(() => {
    dispatch({ type: "RESET" });
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("chatMemory");
    setShowConfirm(false);
    setChatMode("default");
  }, [setChatMode]);

  /* ================ STORAGE (load & save) ================ */
  useEffect(() => {
    const saved: ChatResponseProps[] = loadHistory();
    if (Array.isArray(saved) && saved.length > 0) {
      saved.forEach((m) => dispatch({ type: "ADD", payload: m }));
    }
    hasLoadedRef.current = true;
  }, [])

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    saveHistory(messages);
    const t = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(t);
  }, [messages, scrollToBottom]);



  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const viewport = window.visualViewport;

    const handleResize = () => {
      setIsInputFocused(viewport.height < window.innerHeight - 100);
    };

    viewport.addEventListener("resize", handleResize);
    handleResize();
    return () => viewport.removeEventListener("resize", handleResize);
  }, []);

  /* ================ TELEGRAM SSE (safe parsing + cleanup) ================ */
  useEffect(() => {
    // guard when SSE not available
    if (typeof window === "undefined") return;
    let es: EventSource | null = null;

    try {
      es = new EventSource("/api/telegram/sse");
    } catch (err) {
      console.warn("SSE init failed:", err);
      return;
    }

    const handler = (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data) as { id?: number; text?: string; from?: string };
        if (payload && payload.text) {
          dispatch({
            type: "ADD",
            payload: {
              role: "herry_telegram",
              text: payload.text,
              isLoading: false,
              isStreaming: false,
            } as ChatResponseProps,
          });
        }
      } catch (err) {
        console.warn("Failed to parse SSE data:", err);
      }
    };

    es.addEventListener("message", handler);

    return () => {
      if (es) {
        try {
          es.removeEventListener("message", handler);
          es.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  /* ================ EXPORT (hanya yg dipakai) ================ */
  return {
    messages,
    dispatch,
    input,
    setInput,
    isMinimized,
    setIsMinimized,
    isInputFocused,
    setIsInputFocused,
    clearChat,
    getMemory,
    detectUserName,
    chatMode,
    showConfirm,
    setShowConfirm,
    chatEndRef,
    onMinimize,
  } as const;
}
