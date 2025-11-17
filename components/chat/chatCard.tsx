import { Card } from "../card/card";

export const ChatCards = ({ cards, onConfirm }: any) => (
  <div className="max-w-[80%] sm:max-w-[70%] grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 ml-10 sm:ml-13 mb-2">
    {cards.map((card: any, i: number) => (
      <Card key={i} {...card} onConfirm={onConfirm} />
    ))}
  </div>
);