"use client";

import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { ListWithCards } from "@/types";
import { MoreHorizontal, X } from "lucide-react";
import { ComponentRef, useRef } from "react";
import { toast } from "sonner";

interface ListOptionsProps {
  data: ListWithCards;
  onAddCard(): void;
}
export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ComponentRef<"button">>(null);
  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      closeRef.current?.click();
      toast.success(`List "${data.title}" deleted`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const onDelete = () => {
    const id = data.id;
    const boardId = data.boardId;
    executeDelete({ id, boardId });
  };
  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      closeRef.current?.click();
      toast.success(`List "${data.title}" copied`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const onCopy = () => {
    const id = data.id;
    const boardId = data.boardId;
    executeCopy({ id, boardId });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="flex h-auto w-auto p-1.5 items-center justify-center"
          variant="ghost"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List Actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add Card...
        </Button>
        <form onSubmit={onCopy}>
          <FormSubmit
            className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm"
            variant="ghost"
          >
            Copy List...
          </FormSubmit>
        </form>
        <Separator />
        <form onSubmit={onDelete}>
          <FormSubmit
            className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm"
            variant="destructive"
          >
            Delete this list.
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
