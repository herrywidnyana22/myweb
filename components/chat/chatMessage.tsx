import { ChatItem } from "./chatItem";
import { ChatCards } from "./chatCard";

export const ChatMessages = ({ messages, onConfirmActionCard, endRef }: any) => {
  return (
    <>
      {messages.map((msg: any, i: number) => (
        <div key={i} className={msg.role === "user" ? "text-right" : ""}>
          <ChatItem {...msg} />

          {!!msg.cards?.length && (
            <ChatCards cards={msg.cards} onConfirm={onConfirmActionCard} />
          )}
        </div>
      ))}

      <div ref={endRef} />
    </>
  );
};
