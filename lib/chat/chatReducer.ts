
export type ChatAction =
  | { type: 'ADD'; payload: ChatResponseProps }
  | { type: 'UPDATE_LAST'; payload: Partial<ChatResponseProps> }
  | { type: 'RESET' };

export function chatReducer(
  state: ChatResponseProps[],
  action: ChatAction
): ChatResponseProps[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE_LAST':
      return state.map((msg, i) =>
        i === state.length - 1 ? { ...msg, ...action.payload } : msg
      );
    case 'RESET':
      return [];
    default:
      return state;
  }
}
