"use client";

import { cn } from "@/lib/utils";
import { ListWithCards } from "@/types";
import { ComponentRef, useRef, useState } from "react";
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";
import { ListHeader } from "./list-header";

interface ListItemProps {
  index: number;
  list: ListWithCards;
}

export const ListItem = ({ index, list }: ListItemProps) => {
  const textAreaRef = useRef<ComponentRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    textAreaRef.current?.focus();
    textAreaRef.current?.select();
  };
  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader onAddCard={enableEditing} data={list} />
        <ol
          className={cn(
            "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
            list.cards.length > 0 ? "mt-2" : "mt-0",
          )}
        >
          {list.cards.map((card, index) => {
            return <CardItem key={card.id} data={card} index={index} />;
          })}
        </ol>
        <CardForm
          listId={list.id}
          ref={textAreaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </li>
  );
};
