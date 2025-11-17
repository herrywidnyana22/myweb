// components/chat/useChatLanguage.ts
"use client";
import { loadUI } from "@/lib/translate/translateUIText";
import { translateAll } from "@/lib/translate/app-data";
import { useApp } from "@/context/AppContextProps";
import { useChatCore } from "./useChatCore";

export function useChatLanguage(core: ReturnType<typeof useChatCore>) {
  const { ui, setUI, setLanguage } = useApp();
  const { dispatch } = core;

  const onConfirmLanguage = async (targetLang: string) => {
    // bubble pertama
    dispatch({
      type: "ADD",
      payload: { role: "bot", text: ui.translateOnProgressConfirm },
    });

    await new Promise((r) => setTimeout(r, 600));

    // bubble loading
    dispatch({
      type: "ADD",
      payload: { role: "bot", text: "", isLoading: true },
    });

    // 1. Load UI terlebih dahulu
    const newUI = await loadUI(targetLang);
    setUI(newUI);

    // 2. Simpan bahasa global
    setLanguage(targetLang);

    // 3. Translate dataset
    await translateAll(targetLang);

    // 4. Replace bubble loading jadi final
    dispatch({
      type: "UPDATE_LAST",
      payload: {
        text: newUI.langSwitched,
        isLoading: false,
      },
    });
  };

  return { onConfirmLanguage };
}
