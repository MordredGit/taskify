"use client";

import { updateCard } from "@/actions/update-card";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextArea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ComponentRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface DescriptionProps {
  data: CardWithList;
}

export const Description = ({ data }: DescriptionProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(data.description || undefined);
  const formRef = useRef<ComponentRef<"form">>(null);
  const textareaRef = useRef<ComponentRef<"textarea">>(null);
  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      toast.success(`Description updated for card ${data.title}`);
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      setDescription(data.description);
      disableEditing();
    },
    onError: (error) => toast.error(error),
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    } else if (e.key === "Enter" && e.shiftKey === true) {
      formRef.current?.requestSubmit();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(
    formRef as React.RefObject<HTMLFormElement>,
    disableEditing,
  );

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    const boardId = params.boardId as string;
    if (description === data.description) {
      disableEditing();
      return;
    }
    execute({ description, boardId, id: data.id });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <form ref={formRef} className="space-y-2" action={onSubmit}>
            <FormTextArea
              id="description"
              className="w-full mt-2"
              placeholder="Add a more detailed description"
              defaultValue={description}
              errors={fieldErrors}
              ref={textareaRef}
            />
            <div className="flex items-center gap-x-2 ">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size={"sm"}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
        <Skeleton className="h-[78px] w-full bg-neutral-200" />
      </div>
    </div>
  );
};
