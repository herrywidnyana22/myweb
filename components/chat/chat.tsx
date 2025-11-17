// components/chat/Chat.tsx
"use client";

import clsx from "clsx";
import DialogConfirm from "../dialogConfirm";

import { ChatHeader } from "./chatHeader";
import { ChatInput } from "./chatInput";

import { useChatCore } from "../../hooks/useChatCore";
import { useChatLanguage } from "../../hooks/useChatLanguage";
import { useChatSend } from "../../lib/chat/sendMessage";
import { ChatMessages } from "./chatMessage";

export const Chat = () => {
  const core = useChatCore();
  const { sendMessage } = useChatSend(core)
  const { onConfirmLanguage } = useChatLanguage(core);

  return (
    <>
      <div
        className={clsx(
          "relative z-50 w-full mx-auto transition-all duration-300 ease-in-out",
          core.isInputFocused ? "-translate-y-12 sm:-translate-y-26" : "translate-y-0"
        )}
      >
        <div className="w-full mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-600/50">
          {core.messages.length > 0 && (
            <ChatHeader
              isMinimized={core.isMinimized}
              onClear={() => core.setShowConfirm(true)}
              onMinimize={core.onMinimize}
            />
          )}

          {!core.isMinimized && core.messages.length > 0 && (
            <div className="bg-gray-800/70 backdrop-blur-sm max-h-[65vh] sm:max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-4">
              <ChatMessages
                messages={core.messages}
                onConfirmActionCard={(action: ConfirmAction, typeAction: Action, targetLang?: UILanguage) => {
                  if (typeAction === "language" && action === "yes" && targetLang) onConfirmLanguage(targetLang);
                }}
                endRef={core.chatEndRef}
              />
            </div>
          )}

          <div className="bg-gray-900/90 border-t border-gray-700">
            <ChatInput
              input={core.input}
              setInput={core.setInput}
              sendMessage={sendMessage}              // <- CORRECT NAME
              onFocus={() => core.setIsInputFocused(true)}
              onBlur={() => core.setIsInputFocused(false)}
              setIsMinimized={core.setIsMinimized}
              isActive={(core.messages.length <= 0 && !core.isInputFocused) || core.isMinimized}
            />
          </div>
        </div>
      </div>

      {core.showConfirm && (
        <DialogConfirm
          text={"Clear chat?"}
          onConfirm={core.clearChat}
          onCancel={() => core.setShowConfirm(false)}
        />
      )}
    </>
  );
};
