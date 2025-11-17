
"use client";

import { useApp } from "@/context/AppContextProps";
import { useChatCore } from "../../hooks/useChatCore";

export function useChatSend(core: ReturnType<typeof useChatCore>) {
  const { ui, language } = useApp();
  const { dispatch, messages, chatMode, detectUserName, getMemory } = core;

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = core.input.trim();
    if (!input) return;

    dispatch({ type: "ADD", payload: { role: "user", text: input } });
    core.setInput("");

    detectUserName(input);

    const botRole = chatMode === "telegram" ? "bot_telegram" : "bot";

    dispatch({
      type: "ADD",
      payload: { role: botRole, text: "", isLoading: true },
    });

    try {
       // send last 6 messages as context
      const history = messages.slice(-6).map(({ role, text }) => ({ role, text: text ?? '' }))

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          memory: getMemory(),
          history,
          chatMode,
          language,
        }),
      });

      const data: AIResponse = await res.json();
      const fullText = data.text ?? ui.dataEmpty;
      const cards = data.cards ?? [];

      dispatch({
        type: "UPDATE_LAST",
        payload: { isLoading: false, isStreaming: true, text: "" },
      });

      let typed = "";
      for (const char of fullText) {
        typed += char;
        dispatch({
          type: "UPDATE_LAST",
          payload: { 
            text: typed, 
            isStreaming: true 
          }
        });
        
        // slowdown on punctuation
        if (".!?".includes(char)) {
          await new Promise((r) => setTimeout(r, 60));
        } else {
          await new Promise((r) => setTimeout(r, 12));
        }
      }

      dispatch({
        type: "UPDATE_LAST",
        payload: {
          text: fullText,
          cards,               // cards muncul di bawah teks
          isStreaming: false,
          isLoading: false
        }
      })

    } catch {
      dispatch({
        type: "UPDATE_LAST",
        payload: { 
          text: ui.chatError, 
          isLoading: false, 
          isStreaming: false 
        },
      });
    }
  };

  return { sendMessage };
}
