"use client";

import { updateList } from "@/actions/update-list";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { ListWithCards } from "@/types";
import { useParams } from "next/navigation";
import { ComponentRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { ListOptions } from "./list-options";

interface ListHeaderProps {
  data: ListWithCards;
  onAddCard(): void;
}
export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
  const params = useParams();
  const formRef = useRef<ComponentRef<"form">>(null);
  const inputRef = useRef<ComponentRef<"input">>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute, fieldErrors } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`List "${title}" updated to "${data.title}"`);
      setTitle(title);
      disableEditing();
    },
    onError: (error) => toast.error(error),
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = data.id as string;
    const boardId = params.boardId as string;

    execute({ title, id, boardId });
  };
  const onBlur = () => formRef.current?.requestSubmit();
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
      // disableEditing();
    }
  };
  useEventListener("keydown", onKeyDown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form action={onSubmit} ref={formRef} className="flex-1 px-[2px]">
          <FormInput
            id="title"
            ref={inputRef}
            onBlur={onBlur}
            placeholder="Enter list title"
            defaultValue={title}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
            errors={fieldErrors}
          />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 min-h-7 font-medium border-transparent h-auto"
        >
          {data.title}
        </div>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  );
};
