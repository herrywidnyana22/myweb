// components/chat/ChatStorage.ts
export const loadHistory = () => {
  const raw = localStorage.getItem('chatHistory');
  return raw ? JSON.parse(raw) : [];
};

export const saveHistory = (messages: ChatResponseProps[]) => {
  localStorage.setItem('chatHistory', JSON.stringify(messages));
};
